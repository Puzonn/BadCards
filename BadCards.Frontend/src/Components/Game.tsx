import { Card } from "../Types/Card";
import { Round } from "../Types/Round";
import { useEffect, useState } from "react";
import { Lobby } from "./Lobby/Lobby";
import { LobbySelectedCardsUI } from "./Lobby/LobbySelectedCardsUI";
import LeaderboardIcon from "../Assets/Icons/leaderboard_icon.svg";
import { GameMenuContext } from "./GameMenuContext";
import { Leaderboard } from "./Leaderboard";

export const Game = ({
  BlackCard,
  WhiteCards,
  Players,
  GameStarted,
  LobbySelectedCards,
  JudgeUsername,
  HasSelectedRequired,
  PlayerSelectedCards,
  IsWaitingForJudge,
  SelectedWinnerId,
  IsWaitingForNextRound,
  IsJudge,
  IsCreator,
  AnswerCount,
  HasSelected,
  LobbyCode,
  OnSelectCard,
  StateJudgeSelectCard,
  StateEndGame,
  StateLeaveGame,
  StateStartGame,
  StateKickPlayer,
  StateSelectCards,
  StateNextRound,
  StateAddBot,
}: Round) => {
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(true);
  const AnswerColors: string[] = ["blue-600", "orange-600", "purple-600"];

  useEffect(() => {
    console.log(IsJudge);
    console.log(IsWaitingForJudge);
    if (IsWaitingForNextRound) {
      /// setSelectedCards(LobbySelectedCards);
    }
  }, [LobbySelectedCards]);

  const isCardSelected = (card: Card) => {
    return PlayerSelectedCards.includes(card);
  };

  if (!GameStarted) {
    return (
      <Lobby
        AddBotHandler={StateAddBot}
        IsCreator={IsCreator}
        StartGameHandler={StateStartGame}
        LobbyCode={LobbyCode}
        Players={Players}
        KickHandler={StateKickPlayer}
      ></Lobby>
    );
  }

  const onSelectedCardClicked = (cards: Card[]) => {
    if (!IsWaitingForJudge) {
      console.error(
        "OnSelectedCardClicked invoked when IsWaitingForJudge is false"
      );
    }

    OnSelectCard(cards);
  };

  const formatContent = (content: string): string[] => {
    console.log('original ', content)
    const words = content.split(" ");
    return words;
  };

  let QuestionSpecialColorIndex: number = -1;
  let AnswerSpecialColorIndex: number = -1;

  return (
    <div>
      <div
        className={`grid min-w-screen max-h-screen ${
          isLeaderboardOpen ? "md:grid-cols-[minmax(150px,_250px)_1fr]" : ""
        } gap-4`}
      >
        <Leaderboard
          OnToggleLeaderboard={() => setIsLeaderboardOpen(!isLeaderboardOpen)}
          Players={Players}
          IsLeaderboardOpen={isLeaderboardOpen}
          JudgeUsername={JudgeUsername}
        />
        <div className={`${isLeaderboardOpen ? "hidden" : ""} md:block`}>
          <div className="flex flex-col justify-centerw w-100">
            <div className="text-white w-full items-center text-xl font-medium pl-6 pb-3 pt-3 flex">
              <div className="justify-end mr-7 flex w-full hover:text-opacity-80">
                <div
                  onClick={() => setIsLeaderboardOpen(!isLeaderboardOpen)}
                  className="cursor-pointer hover:text-gray-400"
                >
                  <button
                    className="inline-flex h-10 hover:scale-105 mr-3 justify-center items-center rounded-md bg-white 
             text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    <img
                      className="w-full px-3 py-2 h-full object-cover"
                      src={LeaderboardIcon}
                      alt="Leaderboard Icon"
                    />
                  </button>
                </div>

                <GameMenuContext
                  OnEndGame={StateEndGame}
                  OnLeaveGame={StateLeaveGame}
                />
              </div>
            </div>
            <div className="text-white answer-shadow bg-black mx-2 rounded border border-white">
              <div className="font-medium text-2xl whitespace-pre-wrap p-2">
                {formatContent(BlackCard.Content).map((word, index) => {
                    /* TODO: fix multiple function invoking for getting length */
                  if (word.startsWith("_")) {
                    QuestionSpecialColorIndex++;
                    const showContent =
                      PlayerSelectedCards.length > QuestionSpecialColorIndex;
                    const isSpecialRegex = /[^a-zA-Z0-9\s]/;
                    let selectedCardContent = undefined;

                    if (showContent) {
                      selectedCardContent =
                        PlayerSelectedCards[QuestionSpecialColorIndex].Content;
                      if (isSpecialRegex.test(selectedCardContent)) {
                        selectedCardContent = selectedCardContent.substring(
                          0,
                          selectedCardContent.length - 1
                        );
                      }
                    }

                    return (
                      <span
                        className=" break-words"
                        key={`question_word_${index}`}
                      >
                        <div
                          className={`relative border-b-2 border-${
                            AnswerColors[QuestionSpecialColorIndex]
                          } inline-flex mr-2 ${
                            !showContent ? "min-w-20" : ""
                          } w-auto`}
                        >
                          {showContent && <>{selectedCardContent}</>}
                        </div>
                        {word.replace('_', "")}
                      </span>
                    );
                  }
                  return <span key={`question_word_${index}`}>{word} </span>;
                })}
              </div>
            </div>
            <div className="flex justify-center pt-5 md:pt-0 items-center text-2xl mb-3 p-2 h-20 text-white">
              {PlayerSelectedCards.length === AnswerCount &&
                !IsWaitingForJudge && (
                  <div
                    onClick={() => StateSelectCards(PlayerSelectedCards)}
                    className="cursor-pointer border-2 hover:bg-white hover:text-black border-white p-2 rounded"
                  >
                    Approve
                  </div>
                )}
              {PlayerSelectedCards.length === AnswerCount &&
                IsWaitingForJudge &&
                IsJudge &&
                !IsWaitingForNextRound && (
                  <div
                    onClick={() =>
                      StateJudgeSelectCard(PlayerSelectedCards[0].OwnerId)
                    }
                    className="cursor-pointer border-2 hover:bg-white px-4  hover:text-black border-white p-2 rounded"
                  >
                    Pick Winner
                  </div>
                )}
              {IsWaitingForNextRound && (
                <div
                  onClick={() => StateNextRound()}
                  className="cursor-pointer border-2 hover:bg-white  px-4  hover:text-black border-white p-2 rounded"
                >
                  Next Round
                </div>
              )}
              {IsJudge && !IsWaitingForJudge && !IsWaitingForNextRound && (
                <div className="border-b-2 border-white px-4 p-2 rounded">
                  You're the judge. Wait for all users to choose their cards.
                </div>
              )}
              {IsJudge &&
                IsWaitingForJudge &&
                PlayerSelectedCards.length === 0 && (
                  <div className="border-2 border-white  px-4  p-2 rounded">
                    You're the judge. Choose winner.
                  </div>
                )}
              {!IsJudge && IsWaitingForJudge && !IsWaitingForNextRound && (
                <div className="border-2 border-white px-5 p-2 rounded">
                  Wait for judge to choose a winner.
                </div>
              )}
            </div>
            {!IsWaitingForJudge && !IsJudge && !HasSelected && (
              <div>
                {WhiteCards.map((card, index) => {
                  if (isCardSelected(card)) {
                    AnswerSpecialColorIndex++;
                  }

                  return (
                    <div
                      onClick={() => OnSelectCard(card)}
                      key={`answer_card_${index}`}
                      className={`h-auto white-shadow cursor-pointer bg-white hover:bg-default text-2xl font-medium my-2 mx-4 p-3
         shadow-white text-black rounded ${
           isCardSelected(card)
             ? `border-3 border-${AnswerColors[AnswerSpecialColorIndex]}`
             : ""
         }`}
                    >
                      <div>{card.Content}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {IsWaitingForJudge && (
              <div className="pt-5">
                <LobbySelectedCardsUI
                  onJudgeSelectedCardClicked={StateJudgeSelectCard}
                  isJudge={IsJudge}
                  isWaitingForJudge={IsWaitingForJudge}
                  selectedWinnerId={SelectedWinnerId}
                  lobbySelectedCards={LobbySelectedCards}
                  isWaitingForNextRound={IsWaitingForNextRound}
                  showUsernames={IsWaitingForNextRound}
                  selectedCards={PlayerSelectedCards}
                  onSelectedCardClicked={onSelectedCardClicked}
                  answerCount={AnswerCount}
                  cards={LobbySelectedCards}
                ></LobbySelectedCardsUI>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
