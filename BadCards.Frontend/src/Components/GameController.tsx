import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, Round } from "../Types/Card";
import { Game } from "./Game";
import { Config } from "../Config";
import { ConnectionContext } from "../Context/ConnectionContext";
import { HubConnectionState } from "@microsoft/signalr";
import { setSelectionRange } from "@testing-library/user-event/dist/utils";

export const GameController = () => {
  const { Connection, Build, Send, RegisterHandler } =
    useContext(ConnectionContext);

  const [round, setRound] = useState<Round>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");

  useEffect(() => {
    Build(`${Config.default.ApiUrl}/services/roomHub`);
  }, []);

  useEffect(() => {
    if (
      typeof Connection === undefined ||
      Connection?.state === HubConnectionState.Connected
    ) {
      return;
    }

    Connection?.start().then(() => {
      RegisterHandler("OnJoinEvent", (e) => {
        const round = JSON.parse(e) as Round;
        console.log("OnJoinEvent: ", round);
        setRound(round);
      });
      RegisterHandler("OnStartGame", OnStartGame);
      RegisterHandler("OnStateSelectCard", OnStateSelectCard);
      RegisterHandler("OnJudgeSelectCard", OnJudgeSelectCard);
      RegisterHandler("OnWaitingForJudgeState", OnWaitingForJudgeState);
      RegisterHandler("OnUserDisconnect", OnUserDisconnect);
      RegisterHandler("DebugLog", (e) => console.log(e));
      RegisterHandler("OnNextRound", OnNextRound);
      Send("Join", code);
    });
  }, [Connection]);

  const OnWaitingForJudgeState = (event: any) => {
    /* TODO: Fix json crap i hate this */
    const selectedCards: Card[] = JSON.parse(event).LobbySelectedCards;

    setRound((prev) => {
      if (!prev) {
        return;
      }
      return {
        ...prev,
        LobbySelectedCards: selectedCards,
        IsWaitingForJudge: true,
      };
    });
  };

  const StateStartGame = () => {
    const response = Connection?.invoke("StartGame");
    if (!response) {
      console.error("<StartGameResponse> Need more players");

      return;
    }
    Connection?.send("StartGame");
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

  const StateJudgeSelectCard = async (ownerId: number) => {
    await Connection?.send("JudgeSelectWinner", ownerId);
  };

  const StateSelectCard = async (cards: Card[]) => {
    if (typeof Connection === "undefined") {
      return;
    }

    await Connection?.send(
      "SelectCards",
      cards.map((x) => x.CardId)
    );
  };

  const StateNextRound = async () => {
    if (typeof Connection === "undefined") {
      return;
    }
    await Connection.send("VoteNextRound");
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
        PlayerSelectedCards: [],
      };

      return updatedRound;
    });
  };

  const OnJudgeSelectCard = (e: any) => {
    console.log("judge:", e);
    const parsedEvent = JSON.parse(e);
    console.log("Winner: ", parsedEvent);
    console.log("Winner: ", parsedEvent.CardOwnerId);
    setRound((prev) => {
      if (prev) {
        return {
          ...prev,
          SelectedWinnerId: parsedEvent.CardOwnerId,
          IsWaitingForNextRound: true,
        };
      }
      return prev;
    });
  };

  useEffect(() => {
    console.log("Round updated: ", round);
  }, [round]);

  const OnStartGame = (e: string) => {
    const round = JSON.parse(e) as Round;
    round.IsWaitingForJudge = false;
    round.IsWaitingForNextRound = false;
    round.PlayerSelectedCards = [];
    round.LobbySelectedCards = [];
    setRound(round);
  };

  const OnSelectCard = (card: Card | Card[]) => {
    if (Array.isArray(card)) {
      setRound((prev) => {
        if (!prev) {
          return prev;
        }

        if (card.length === 1) {
          if (prev.PlayerSelectedCards.includes(card[0])) {
            return {
              ...prev,
              PlayerSelectedCards: prev.PlayerSelectedCards.filter(
                (x) => x !== card[0]
              ),
            };
          }
        }

        return {
          ...prev,
          PlayerSelectedCards: card,
        };
      });

      return;
    }

    setRound((prev) => {
      if (!prev) {
        return prev;
      }

      if (prev.PlayerSelectedCards.includes(card)) {
        return {
          ...prev,
          PlayerSelectedCards: prev.PlayerSelectedCards.filter(
            (x) => x !== card
          ),
        };
      }

      return {
        ...prev,
        PlayerSelectedCards: [...prev.PlayerSelectedCards, card],
      };
    });
  };

  if (typeof round === "undefined") {
    return <></>;
  }

  return (
    <>
      <Game
        OnSelectCard={OnSelectCard}
        SelectedWinnerId={round.SelectedWinnerId}
        LobbySelectedCards={round.LobbySelectedCards}
        AnswerCount={round.AnswerCount}
        HasSelectedRequired={round.HasSelectedRequired}
        IsWaitingForNextRound={round.IsWaitingForNextRound}
        IsWaitingForJudge={round.IsWaitingForJudge}
        JudgeUsername={round.JudgeUsername}
        IsJudge={round.IsJudge}
        PlayerSelectedCards={round.PlayerSelectedCards}
        LobbyCode={code as string}
        IsCreator={round.IsCreator}
        GameStarted={round.GameStarted}
        Players={round.Players}
        WhiteCards={round.WhiteCards}
        BlackCard={round.BlackCard}
        StateJudgeSelectCard={StateJudgeSelectCard}
        StateNextRound={StateNextRound}
        StateSelectCards={StateSelectCard}
        StateStartGame={StateStartGame}
      />
    </>
  );
};
