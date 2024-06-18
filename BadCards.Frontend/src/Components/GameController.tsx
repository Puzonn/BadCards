import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Round } from "../Types/Round";
import { Card } from "../Types/Card";
import { Game } from "./Game";
import { Config } from "../Config";
import { ConnectionContext } from "../Context/ConnectionContext";
import { HubConnectionState } from "@microsoft/signalr";
import { AuthContext } from "../Context/AuthContext";

export const GameController = () => {
  const { Connection, Build, Send, RegisterHandler } =
    useContext(ConnectionContext);
  const { IsLoggedIn, IsFetched } = useContext(AuthContext);
  const [round, setRound] = useState<Round>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");

  useEffect(() => {
    if (!IsLoggedIn && IsFetched) {
      const codeParm = searchParams.get("code");
      window.location.href = `/start?code=${codeParm}`;
    } else if (IsLoggedIn && IsFetched) {
      Build(`${Config.default.ApiUrl}/services/roomHub`);
    }
  }, [IsLoggedIn, IsFetched]);

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
        setRound(round);
      });
      RegisterHandler("OnStartGame", OnStartGame);
      RegisterHandler("OnStateSelectCard", OnStateSelectCard);
      RegisterHandler("OnJudgeSelectCard", OnJudgeSelectCard);
      RegisterHandler("OnWaitingForJudgeState", OnWaitingForJudgeState);
      RegisterHandler("ForceDisconnect", ForceDisconnect);
      RegisterHandler("OnUserDisconnect", OnUserDisconnect);
      RegisterHandler("DebugLog", (e) => console.log(e));
      RegisterHandler("OnNextRound", OnNextRound);
      Send("Join", code);
    });
  }, [Connection]);

  const ForceDisconnect = (e: string) => {
    if (e === "gameEnded") {
      window.location.href = "/?gameEnded=true";
    } else if (e === "kick") {
      window.location.href = "/?kick=true";
    }

    window.location.href = "/";
  };

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

  const StateAddBot = () => {
    Connection?.send("AddBot");
  };

  const OnUserDisconnect = (userId: number) => {
    setRound((prev) => {
      if (!prev) {
        return prev;
      }

      const players = [...prev.Players].filter((x) => x.UserId === userId);
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

  const StateLeaveGame = async () => {};

  const StateKickPlayer = async (userId: number) => {
    await Connection?.send("KickPlayer", userId);
  };

  const StateEndGame = async () => {
    await Connection?.send("EndGame");
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
    const parsedEvent = JSON.parse(e);

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

  const OnStartGame = (e: string) => {
    const round = JSON.parse(e) as Round;
    round.IsWaitingForJudge = false;
    round.IsWaitingForNextRound = false;
    round.PlayerSelectedCards = [];
    round.LobbySelectedCards = [];
    setRound(round);
  };

  const OnSelectCard = (card: Card | Card[]) => {
    /* If answer count is >= AnswerCount */
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
        if (prev.PlayerSelectedCards.length === round?.AnswerCount) {
          return;
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

      if (prev.PlayerSelectedCards.length === round?.AnswerCount) {
        return { ...prev, PlayerSelectedCards: [card] };
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
        StateAddBot={StateAddBot}
        HasSelected={round.HasSelected}
        StateKickPlayer={StateKickPlayer}
        StateEndGame={StateEndGame}
        StateLeaveGame={StateLeaveGame}
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
