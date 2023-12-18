import { Round } from "../Types/Card";
import { BlackCardUI } from "./BlackCardUI";
import { WhiteCardUI } from "./WhiteCardUI";
import "./Styles/Game.css";
import "./Styles/LobbyManager.css";
import { useTranslation } from "react-i18next";
import { Leaderboard } from "./Leaderboard";
import { SelectedCardsContainer } from "./SelectedCardsContiner";
import { useState } from "react";

export const Game = ({
  BlackCard,
  WhiteCards,
  Players,
  GameStarted,
  JudgeUsername,
  HasSelectedRequired,
  SelectedCards,
  IsWaitingForJudge,
  IsWaitingForNextRound,
  IsJudge,
  IsCreator,
  AnswerCount,
  RoomCode,
  StateStartGame,
  StateSelectCard,
  StateNextRound,
}: Round) => {
  const { t } = useTranslation();
  const [codeCopied, setCodeCopied] = useState(false);

  const CopyCode = async () => {
    await navigator.clipboard.writeText(RoomCode);
    setCodeCopied(!codeCopied);
    setTimeout(() => {
      setCodeCopied(false);
    }, 2500);
  };

  const StartGame = () => {
    StateStartGame();
  };

  if (!GameStarted) {
    return (
      <div className="room-lobby-container">
        <div className="room-lobby">
          <h2 onClick={CopyCode} className="room-lobby-code">
            Lobby Code: {RoomCode}
          </h2>
          <span
            className={`${
              codeCopied
                ? "room-lobby-copy-note"
                : "room-lobby-copy-note_hidden"
            }`}
          >
            Lobby Code copied to clipboard
          </span>
        </div>
        <div className="room-lobby-opt">
          <div>
            <span className="room-lobby-left">Players: </span>
            <ul className="room-players-cell">
              {Players.map((player, index) => {
                return (
                  <li key={`room-lobby-player-cell-${player.Username}`}>
                    <img
                      alt="UserDiscordAvatar"
                      src={`https://cdn.discordapp.com/avatars/${player.DiscordUserId}/${player.DiscordAvatarId}.webp?size=64`}
                    ></img>
                    <span>{player.Username}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="room-lobby-game_options"></div>
        </div>

        {IsCreator && (
          <button onClick={StartGame} className="room-lobby-start">
            Start
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "15px" }}>
      <div className="cards-container">
        <BlackCardUI
          CardId={BlackCard.CardId}
          Content={BlackCard.Content}
          IsBlack={BlackCard.IsBlack}
        />
        <div className="cards-selected-container">
          {SelectedCards && (
            <SelectedCardsContainer
              RoomCode={RoomCode}
              AnswerCount={AnswerCount}
              Players={Players}
              GameStarted={true}
              IsCreator={IsCreator}
              HasSelectedRequired={HasSelectedRequired}
              IsWaitingForNextRound={IsWaitingForNextRound}
              IsJudge={IsJudge}
              SelectedCards={SelectedCards}
              StateNextRound={() => {}}
              BlackCard={BlackCard}
              WhiteCards={WhiteCards}
              JudgeUsername={JudgeUsername}
              IsWaitingForJudge={IsWaitingForJudge}
              StateSelectCard={StateSelectCard}
              StateStartGame={() => {}}
            ></SelectedCardsContainer>
          )}
        </div>
        <Leaderboard Players={Players} />
      </div>
      <div className="judge-username-container">
        <span className="judge-username">
          {!IsWaitingForNextRound && (
            <p>
              {IsJudge && !IsWaitingForJudge && (
                <span> {t("game.you-are-judge")} </span>
              )}
              {IsJudge && IsWaitingForJudge && (
                <span> {t("game.select-winning-card")} </span>
              )}
              {!IsJudge && !IsWaitingForJudge && SelectedCards && (
                <>
                  <span>
                    {t("game.judge")}: {JudgeUsername}
                  </span>
                  <p>Select {AnswerCount - SelectedCards?.length} more cards</p>
                </>
              )}

              {!IsJudge && IsWaitingForJudge && (
                <span>
                  {t("game.judge-waiting", { "judge.name": JudgeUsername })}
                </span>
              )}
            </p>
          )}
        </span>
        {IsWaitingForNextRound && (
          <div>
            <button onClick={StateNextRound} className="cards-next-round-btn">
              {t("game.next-round")}
            </button>
          </div>
        )}
      </div>
      <div className="white-cards-container">
        {WhiteCards.map((card) => {
          return (
            <WhiteCardUI
              HasSelectedRequired={HasSelectedRequired}
              IsSelected={false}
              key={`white_card_${card.CardId}`}
              IsJudge={IsJudge}
              StateCardClicked={StateSelectCard}
              CardId={card.CardId}
              Content={card.Content}
              IsBlack={card.IsBlack}
            />
          );
        })}
      </div>
    </div>
  );
};
