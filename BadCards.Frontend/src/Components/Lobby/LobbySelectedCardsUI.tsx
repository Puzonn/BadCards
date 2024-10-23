import { isStringLiteral } from "typescript";
import { Card } from "../../Types/Card";
import { useEffect, useState } from "react";
import { ConsoleLogger } from "@microsoft/signalr/dist/esm/Utils";
import { Player } from "../../Types/Player";

export const LobbySelectedCardsUI = ({
  cards,
  answerCount,
  isWaitingForNextRound,
  isWaitingForJudge,
  isJudge,
  onSelectedCardClicked,
  showUsernames,
  players,
  selectedCards,
  selectedWinnerId,
  AnswerCount,
  lobbySelectedCards,
}: {
  players: Player[];
  isJudge: boolean;
  isWaitingForJudge: boolean;
  selectedWinnerId: string;
  lobbySelectedCards: Card[];
  AnswerCount: number;
  isWaitingForNextRound: boolean;
  cards: Card[];
  answerCount: number;
  onSelectedCardClicked: (chunk: Card[]) => void;
  onJudgeSelectedCardClicked: (ownerId: string) => void;
  selectedCards: Card[];
  showUsernames: boolean;
}) => {
  const [selectedChunk, setSelectedChunk] = useState<number>(-1);

  const SelectedCardClicked = (cards: Card[]) => {
    if (!isJudge) {
      return;
    }
    onSelectedCardClicked(cards);
  };

  const AnswerColors: string[] = ["blue-600", "orange-600", "purple-600"];
  function GroupCardsByOwner(cards: Card[]): Record<string, Card[]> {
    return cards.reduce((groupedCards, card) => {
      const { OwnerId } = card;
      if (!groupedCards[OwnerId]) {
        groupedCards[OwnerId] = [];
      }
      groupedCards[OwnerId].push(card);
      return groupedCards;
    }, {} as Record<string, Card[]>);
  }

  if (!cards) {
    return <></>;
  }

  if (true) {
    const cards = GroupCardsByOwner(lobbySelectedCards);
    return (
      <>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-2 w-full">
          {players.map((player, index) => {
            if (cards[player.UserId] === undefined) {
              return <></>;
            }

            return (
              <>
                <div
                  onClick={() => {
                    SelectedCardClicked(cards[player.UserId]);
                    if (!isJudge) {
                      return;
                    }
                    setSelectedChunk(index);
                  }}
                  key={`card-selected-${index}`}
                  className={`bg-accent px-2 relative py-2 cursor-pointer text-white rounded flex flex-col gap-1 text-lg font-normal ${
                    selectedChunk === index ? "border-2 border-white" : ""
                  }`}
                >
                  <div className="absolute -top-2 -right-2">
                    <img
                      className="w-8 rounded-full"
                      src={`https://cdn.discordapp.com/avatars/${player.DiscordUserId}/${player.DiscordAvatarId}.webp?size=100`}
                    ></img>
                  </div>
                  {cards[player.UserId]?.map((card, propIndex) => {
                    return (
                      <div key={`card-prop-selected-${propIndex}`}>
                        <span
                          className={`border-b-${AnswerColors[propIndex]} border-b-2`}
                        >
                          {card.Content}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })}
        </div>
      </>
    );
  }
};
