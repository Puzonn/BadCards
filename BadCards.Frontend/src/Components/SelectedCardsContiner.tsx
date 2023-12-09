import { AuthContext } from "../Context/AuthContext";
import { ISelectedWhiteCard, Round } from "../Types/Card";
import { SelectedWhiteCardUI } from "./SelectedWhiteCard";
import { useState, useEffect, useContext } from "react";

export const SelectedCardsContainer = (round: Round) => {
  const [sortedSelectedCards, setSortedSelectedCards] = useState<{
    [key: string]: ISelectedWhiteCard[];
  }>({});

  const [answerIndex, setAnswerIndex] = useState(0);

  const HandleAnswerIndexClick = (index: number) => {
    setAnswerIndex(index);
  };

  useEffect(() => {
    setSortedSelectedCards(sort());
  }, [round.SelectedCards]);

  function sort() {
    const cpy: { [key: string]: ISelectedWhiteCard[] } = {};

    round.SelectedCards!.forEach((card) => {
      if (!cpy[card.SelectedByUsername]) {
        cpy[card.SelectedByUsername] = [];
      }
      cpy[card.SelectedByUsername].push(card);
    });
    console.log("SelectedCardCotainer sorted out cards: ", cpy);
    return cpy;
  }

  return (
    <>
      {Object.keys(sortedSelectedCards).map((i) => {
        const card = sortedSelectedCards[i][answerIndex];
        return (
          <div style={{display: 'contents'}} key={`s_${card}`}>
            {round.SelectedCards && ( //Prevent crashing on "NextRoundEvent"
              <SelectedWhiteCardUI
                AnswerSelectedIndex={answerIndex}
                HandleAnswerIndexClick={HandleAnswerIndexClick}
                AnswerCount={sortedSelectedCards[i].length}
                IsOwner={card.IsOwner}
                key={`SelectedWhiteCard_${card}`}
                IsSelectedByJudge={card.IsSelectedByJudge}
                SelectedBy={card.SelectedBy}
                ShowContent={round.IsWaitingForJudge || card.IsOwner}
                IsJudge={round.IsJudge}
                SelectedByUsername={card.SelectedByUsername}
                ShowUsername={round.IsWaitingForNextRound}
                IsSelected={card.IsSelected}
                IsWaitingForNextRound={round.IsWaitingForNextRound}
                HasSelectedRequired={card.HasSelectedRequired}
                IsBlack={false}
                Content={card.Content}
                CardId={card.CardId}
                StateCardClicked={round.StateSelectCard}
              />
            )}
          </div>
        );
      })}
    </>
  );
};
