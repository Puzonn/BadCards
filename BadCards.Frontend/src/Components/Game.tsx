import { Round } from "../Types/Card";
import { BlackCardUI } from "./BlackCardUI";
import { WhiteCardUI } from "./WhiteCardUI";
import "./Styles/Game.css";
import { SelectedWhiteCardUI } from "./SelectedWhiteCard";
import { useTranslation } from "react-i18next";
import { Leaderboard } from "./Leaderboard";
import { SelectedCardsContainer } from "./SelectedCardsContiner";

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

  if (!GameStarted) {
    return (
      <div className="room-lobby">
        <div className="room-lobby-code">Lobby Code: {RoomCode}</div>
        <span>Share this code to </span>
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
        {IsCreator && (
          <button className="room-lobby-start" onClick={StateStartGame}>
            {t("dashboard.start-lobby")}
          </button>
        )}
        {!IsCreator && (
          <span className="room-lobby-waiting">Waiting for Creator</span>
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
              {!IsJudge && !IsWaitingForJudge && (
                <>
                  <span>
                    {t("game.judge")}: {JudgeUsername}
                  </span>
                  <p>
                    {" "}
                    Select {AnswerCount - SelectedCards!.length} more cards
                  </p>
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
