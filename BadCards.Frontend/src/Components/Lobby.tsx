import {
  HttpTransportType,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Round } from "../Types/Card";
import { Game } from "./Game";

const hubConnection = new HubConnectionBuilder()
  .withUrl("https://localhost:7083/services/roomHub", {
    withCredentials: true,
    timeout: 1000000 * 60,
    skipNegotiation: true,
    transport: HttpTransportType.WebSockets,
  })
  .configureLogging(LogLevel.Debug)
  .build();

export const Lobby = () => {
  const [round, setRound] = useState<Round>();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");

  useEffect(() => {
    hubConnection.start().then(() => {
      hubConnection.onclose(() => {
        window.location.href = "/dashboard"
      })
      hubConnection.on("OnJoinEvent", (e) => {
        const round = JSON.parse(e) as Round;
        round.WhiteCards.forEach((x) => (x.StateCardClicked = StateSelectCard));
        console.warn("OnJoinEvent ", round.SelectedCards);
        setRound(round);
      });
      hubConnection.on("OnStartGame", OnStartGame);
      hubConnection.on("OnStateSelectCard", OnStateSelectCard);
      hubConnection.on("OnJudgeSelectCard", OnJudgeSelectCard);
      hubConnection.on("OnNextRoundVote", (e) => console.log(e));
      hubConnection.on("OnNextRound", OnNextRound);
      hubConnection.send("Join", `${code}`);
    });
  }, []);

  const StateStartGame = () => {
    hubConnection.send("StartGame");
  };

  const OnStateSelectCard = (event: any) => {
    const response = JSON.parse(event);
    setRound((prev) => {
      if (prev) {
        const updatedRound: Round = {
          ...prev,
          HasSelectedRequired: response.HasSelectedRequired,
          SelectedCards: response.SelectedCards,
          IsWaitingForJudge: response.IsWaitingForJudge,
        };
        console.log("WaitingForJudgeState: ", response);
        if (response.ShouldDeleteCard) {
          const index = prev.WhiteCards.findIndex(
            (x) => x.CardId === response.SelectDeletedCard
          );
          prev.WhiteCards = prev.WhiteCards.splice(index, 1);
        }

        return updatedRound;
      }
      return prev;
    });
  };

  useEffect(() => {
    if(!round){
      console.warn("Round refreshed but was undefined", round)
    }
    else{
      console.log("Round refreshed (by UseEffect)", round);
    }
  }, [round]);

  const StateSelectCard = async (cardId: number) => {
    await hubConnection.send("SelectCard", cardId);
  };

  const StateNextRound = async () => {
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
    console.log("Judge selected card, changing <Round>", e);
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
    console.log(e)
    setRound(JSON.parse(e));
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
          RoomCode={round.RoomCode}
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
