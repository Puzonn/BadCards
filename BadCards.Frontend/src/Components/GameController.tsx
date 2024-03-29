import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Round } from "../Types/Card";
import { Game } from "./Game";
import { Config } from "../Config";
import useConnection from "../Hooks/useConnection";

export const GameController = () => {
  const hubConnection = useConnection(
    `${Config.default.ApiUrl}/services/roomHub`,
    () => {
      hubConnection.onclose(() => {
        window.location.href = "/dashboard";
      });
      hubConnection.on("OnJoinEvent", (e) => {
        const round = JSON.parse(e) as Round;
        round.WhiteCards.forEach((x) => (x.StateCardClicked = StateSelectCard));
        setRound(round);
      });
      hubConnection.on("OnStartGame", OnStartGame);
      hubConnection.on("OnStateSelectCard", OnStateSelectCard);
      hubConnection.on("OnJudgeSelectCard", OnJudgeSelectCard);
      hubConnection.on("OnUserDisconnect", OnUserDisconnect);
      hubConnection.on("DebugLog", (e) => console.log(e));
      hubConnection.on("OnNextRound", OnNextRound);
      hubConnection.send("Join", `${code}`);
    }
  );

  const [round, setRound] = useState<Round>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");

  const StateStartGame = () => {
    console.log('r')
    const response = hubConnection.invoke("StartGame");
    if (!response) {
      console.error("<StartGameResponse> Need more players");
    }
  };

  const OnUserDisconnect = (discordUserId: any) => {
    setRound((prev) => {
      if (!prev) {
        return prev;
      }

      const players = [...prev.Players].filter(
        (x) => x.DiscordUserId != (discordUserId as string)
      );
      return { ...prev, Players: players };
    });
  };

  const OnStateSelectCard = (event: any) => {
    const response = JSON.parse(event);
    setRound((prev) => {
      if (!prev) {
        return prev;
      }

      const updatedRound: Round = {
        ...prev,
        HasSelectedRequired: response.HasSelectedRequired,
        SelectedCards: response.SelectedCards,
        IsWaitingForJudge: response.IsWaitingForJudge,
      };

      if (response.ShouldDeleteCard) {
        const index = prev.WhiteCards.findIndex(
          (x) => x.CardId === response.SelectDeletedCard
        );
        prev.WhiteCards = prev.WhiteCards.splice(index, 1);
      }

      return updatedRound;
    });
  };

  const StateSelectCard = async (cardId: number) => {
    if (typeof hubConnection === "undefined") {
      return;
    }
    await hubConnection.send("SelectCard", cardId);
  };

  const StateNextRound = async () => {
    if (typeof hubConnection === "undefined") {
      return;
    }
    await hubConnection.send("VoteNextRound");
  };

  const OnNextRound = (event: any) => {
    setRound((prev) => {
      const parsedEvent = JSON.parse(event);

      if (!prev) {
        return prev;
      }

      const updatedRound: Round = {
        ...prev,
        Players: parsedEvent.Players,
        HasSelectedRequired: false,
        BlackCard: parsedEvent.BlackCard,
        IsJudge: parsedEvent.IsJudge,
        JudgeUsername: parsedEvent.JudgeUsername,
        WhiteCards: parsedEvent.WhiteCards,
        IsWaitingForJudge: false,
        IsWaitingForNextRound: false,
        SelectedCards: [],
      };

      return updatedRound;
    });
  };

  const OnJudgeSelectCard = (e: any) => {
    setRound((prev) => {
      if (prev) {
        const updated: Round = {
          ...prev,
          IsWaitingForNextRound: true,
        };

        const index = prev.SelectedCards?.findIndex(
          (x) => x.CardId === JSON.parse(e).SelectedCardId
        );

        if (
          index !== -1 &&
          typeof index !== "undefined" &&
          typeof prev.SelectedCards !== "undefined"
        ) {
          updated.SelectedCards!.at(index)!.IsSelectedByJudge = true;
        }

        console.log("Updated at JudgeSelectCard ", updated);
        return updated;
      }
      return prev;
    });
  };

  const OnStartGame = (e: string) => {
    const round = JSON.parse(e) as Round;
    round.IsWaitingForJudge = false;
    round.IsWaitingForNextRound = false;
    round.SelectedCards = [];
    setRound(round);
  };

  if (typeof round !== "undefined") {
    return (
      <>
        <Game
          AnswerCount={round.AnswerCount}
          HasSelectedRequired={round.HasSelectedRequired}
          IsWaitingForNextRound={round.IsWaitingForNextRound}
          IsWaitingForJudge={round.IsWaitingForJudge}
          JudgeUsername={round.JudgeUsername}
          IsJudge={round.IsJudge}
          SelectedCards={round.SelectedCards}
          LobbyCode={code as string}
          IsCreator={round.IsCreator}
          GameStarted={round.GameStarted}
          Players={round.Players}
          WhiteCards={round.WhiteCards}
          BlackCard={round.BlackCard}
          StateNextRound={StateNextRound}
          StateSelectCard={StateSelectCard}
          StateStartGame={StateStartGame}
        />
      </>
    );
  }

  return <></>;
};
