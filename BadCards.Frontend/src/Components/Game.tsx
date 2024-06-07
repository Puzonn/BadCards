import { Round } from "../Types/Card";
import { BlackCardUI } from "./BlackCardUI";
import { WhiteCardUI } from "./WhiteCardUI";
import "./Styles/Game.css";
import "./Styles/LobbyManager.css";
import { useTranslation } from "react-i18next";
import { Leaderboard } from "./Leaderboard";
import { SelectedCardsContainer } from "./SelectedCardsContiner";
import { useEffect, useState } from "react";
import { Lobby } from "./Lobby";
import { Col, Container, Row } from "react-bootstrap";

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
  LobbyCode,
  StateStartGame,
  StateSelectCard,
  StateNextRound,
}: Round) => {
  const { t } = useTranslation();
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    setCodeCopied(true);
  });

  const CopyCode = async () => {
    await navigator.clipboard.writeText(LobbyCode);
    setCodeCopied(!codeCopied);
    setTimeout(() => {
      setCodeCopied(false);
    }, 2500);
  };

  if (!GameStarted) {
    return (
      <Lobby
        isCreator={IsCreator}
        startGameHandler={StateStartGame}
        lobbyCode={LobbyCode}
        players={Players}
      ></Lobby>
    );
  }

  return (
    <div style={{ paddingTop: "15px" }}>
      <Container>
        <Row>
          <Col md={4}>
            <BlackCardUI
              CardId={BlackCard.CardId}
              Content={BlackCard.Content}
              IsBlack={BlackCard.IsBlack}
            />
          </Col>
          <Col md={{ span: 4, offset: 4 }}>
            <Leaderboard Players={Players} />
          </Col>
        </Row>
      </Container>
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
            <button
              onClick={StateNextRound}
              className="text-black cards-next-round-btn"
            >
              {t("game.next-round")}
            </button>
          </div>
        )}
      </div>
      <div style={{ overflowX: "auto" }}>
        <Row style={{ flexWrap: "nowrap" }}>
          {WhiteCards.map((card) => {
            return (
              <Col>
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
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};
