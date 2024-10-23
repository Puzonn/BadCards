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

  const isCardSelected = (card: Card) => {
    return PlayerSelectedCards.includes(card);
  };

  if (!GameStarted) {
    return (
      <Lobby
        LeaveGame={StateLeaveGame}
        EndGame={StateEndGame}
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
    console.log("Original Content", content);
    const words = content.split(" ");

    for (let word of words) {
      const isSpecialRegex = /_[\W]/;
      if (isSpecialRegex.test(word)) {
        words[words.indexOf(word)] = `${word} `;
      }
    }
    return words;
  };

  let QuestionSpecialColorIndex: number = -1;
  let AnswerSpecialColorIndex: number = -1;

  return (
    <div>
      <div
        className={`grid min-w-screen max-h-screen ${
          isLeaderboardOpen ? "md:grid-cols-[minmax(150px,_250px)_1fr]" : ""
        }`}
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
            <div className="text-white bg-accent shadow-md shadow-black mx-2">
              <div className="text-pretty text-xl px-2 py-2">
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
                        className="break-words"
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
                        {word.replace("_", "")}
                      </span>
                    );
                  }
                  return <span key={`question_word_${index}`}>{word} </span>;
                })}
              </div>
            </div>
            <div className="flex justify-center md:pt-0 items-center text-2xl my-3 px-2 text-white">
              {IsJudge && !IsWaitingForJudge && !IsWaitingForNextRound && (
                <div className="bg-accent items-center p-2 rounded">
                  You're the judge. Wait for all users to choose their cards.
                </div>
              )}
              {IsJudge && IsWaitingForJudge && (
                <div className="bg-accent items-center p-2 rounded">
                  You're the judge. Choose winner.
                </div>
              )}
              {!IsJudge && IsWaitingForJudge && !IsWaitingForNextRound && (
                <div className="bg-accent bg-opacity-80 p-2 rounded">
                  Wait for judge to choose a winner.
                </div>
              )}
            </div>
            {!IsWaitingForJudge && !IsJudge && !HasSelected && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {WhiteCards.map((card, index) => {
                  if (isCardSelected(card)) {
                    AnswerSpecialColorIndex++;
                  }
                  return (
                    <div
                      onClick={() => OnSelectCard(card)}
                      key={`answer-card-${index}`}
                      className={`bg-accent p-2 text-white cursor-pointer hover:bg-opacity-80 mx-3 rounded ${
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
              <>
                <LobbySelectedCardsUI
                  players={Players}
                  AnswerCount={AnswerCount}
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
              </>
            )}
            <div className="flex justify-center items-center bg-opacity md:pt-0 text-2xl my-3 px-2 text-white">
              {!IsWaitingForJudge && !IsJudge && !IsWaitingForNextRound && (
                <button
                  onClick={() => StateSelectCards(PlayerSelectedCards)}
                  className={`flex justify-between cursor-pointer bg-accent mb-64 hover:bg-opacity-80 items-center p-2 rounded ${
                    PlayerSelectedCards.length === AnswerCount
                      ? "text-white bg-accent"
                      : "text-zinc-600 bg-opacity-30"
                  }`}
                >
                  Approve
                </button>
              )}
              {IsJudge && !IsWaitingForNextRound && (
                <button
                  onClick={() =>
                    StateJudgeSelectCard(PlayerSelectedCards[0].OwnerId)
                  }
                  disabled={PlayerSelectedCards.length !== 1}
                  className={`flex justify-between cursor-pointer bg-accent mb-64 hover:bg-opacity-80 items-center p-2 rounded ${
                    PlayerSelectedCards.length === AnswerCount &&
                    IsWaitingForJudge &&
                    IsJudge &&
                    !IsWaitingForNextRound
                      ? "text-white bg-accent"
                      : "text-zinc-600 bg-opacity-30"
                  }`}
                >
                  Pick Winner
                </button>
              )}
              {IsWaitingForNextRound && (
                <button
                  onClick={() => StateNextRound()}
                  className="bg-accent hover:bg-opacity-80 items-center p-2 rounded cursor-pointer"
                >
                  Next Round
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
