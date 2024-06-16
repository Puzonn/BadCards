import { isStringLiteral } from "typescript";
import { Card } from "../../Types/Card";
import { useEffect } from "react";
import { ConsoleLogger } from "@microsoft/signalr/dist/esm/Utils";

export const LobbySelectedCardsUI = ({
  cards,
  answerCount,
  isWaitingForNextRound,
  isWaitingForJudge,
  isJudge,
  onSelectedCardClicked,
  showUsernames,
  selectedCards,
  selectedWinnerId,
  lobbySelectedCards,
}: {
  isJudge: boolean;
  isWaitingForJudge: boolean;
  selectedWinnerId: number;
  lobbySelectedCards: Card[];
  isWaitingForNextRound: boolean;
  cards: Card[];
  answerCount: number;
  onSelectedCardClicked: (chunk: Card[]) => void;
  onJudgeSelectedCardClicked: (ownerId: number) => void;
  selectedCards: Card[];
  showUsernames: boolean;
}) => {
  const SelectedCardClicked = (cards: Card[]) => {
    onSelectedCardClicked(cards);
  };

  if (!cards) {
    return <></>;
  }

  if (answerCount == 1) {
    return (
      <>
        {cards.map((card, index) => {
          const isSelected = card.CardId === selectedCards[0]?.CardId;
          const isSelectedByJudge =
            selectedWinnerId !== undefined
              ? selectedWinnerId === card.OwnerId
              : false;

          return (
            <div key={`selected_card_${index}`}>
              <div className="flex justify-center text-white text-3xl font-medium">
                <div>{`${isWaitingForNextRound ? card.OwnerUsername : ""} ${
                  isSelectedByJudge ? "🏆" : ""
                }`}</div>
              </div>
              <div
                onClick={() => SelectedCardClicked([card])}
                className={`h-auto white-shadow cursor-pointer bg-white hover:bg-default text-2xl font-medium my-2 mx-4 p-3
                shadow-white text-black rounded ${
                  isSelected ? "border-2 border-y-amber-300" : ""
                }`}
              >
                <div>{card.Content}</div>
              </div>
            </div>
          );
        })}
      </>
    );
  }

  if (answerCount === 2) {
    const chunks: Card[][] = [];
    for (let i = 0; i < cards.length; i += 2) {
      chunks.push([cards[i], cards[i + 1]]);
    }

    return (
      <>
        {chunks.map((chunk, index) => {
          const isSelected = chunk.find(
            (x) => x.CardId === selectedCards[0]?.CardId
          );
          const isSelectedByJudge =
            selectedWinnerId !== undefined
              ? selectedWinnerId === chunk[0].OwnerId
              : false;

          return (
            <div key={`selected_card_${index}`}>
              <div className="flex justify-center text-white text-3xl font-medium">
                <div>Puzonne {isSelectedByJudge ? "🏆" : ""}</div>
              </div>
              <div
                className={`h-auto white-shadow cursor-pointer bg-white hover:bg-default text-2xl font-medium my-2 mx-4 p-3
                   shadow-white text-black rounded ${
                     isSelected ? "border-2 border-y-amber-300" : ""
                   }`}
              >
                <div
                  onClick={() => {
                    SelectedCardClicked(chunk);
                  }}
                >
                  <div className="border-b-2 inline-flex border-blue-600 w-auto">
                    {chunk[0].Content}
                  </div>
                  <br></br>
                  <div className="border-b-2 inline-flex border-orange-600">
                    {chunk[1].Content}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  }

  return <></>;
};
