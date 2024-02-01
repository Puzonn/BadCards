import { ISelectedWhiteCard } from "../Types/Card";
import "./Styles/WhiteCard.css";
import { useEffect, useState } from "react";

export const SelectedWhiteCardUI = (card: ISelectedWhiteCard) => {
  useEffect(() => {
    console.warn(card);
  }, []);

  const HandleCardClick = (cardId: number) => {
    if (!card.IsSelected || card.IsJudge) {
      card.StateCardClicked!(cardId);
    }
  };

  const HandleAnswerIndexClick = (e: any, index: number) => {
    e.stopPropagation();
    card.HandleAnswerIndexClick(index);
  };

  return (
    <div
      onClick={() => {
        HandleCardClick(card.CardId);
      }}
      className={`white-card white-card-bottom-rounded ${
        card.IsSelected && !card.IsJudge ? "selected" : ""
      } ${card.IsSelectedByJudge ? "white-card-judge-selected" : ""}`}
      style={{
        opacity: card.IsWaitingForNextRound && !card.IsSelected ? 0.5 : "",
      }}
    >
      <div className="white-card-answer-selections">
        {card.AnswerCount >= 2 &&
          Array(card.AnswerCount)
            .fill(undefined)
            .map((c, index) => {
              return (
                <div
                  key={`selected_card_${index}`}
                  onClick={(e) => HandleAnswerIndexClick(e, index)}
                  className={`white-card-answer-selection ${
                    index == card.AnswerSelectedIndex
                      ? "white-card-answer-selected"
                      : ""
                  }`}
                >
                  <span>{index}</span>
                </div>
              );
            })}
      </div>
      <div className="white-card-question">
        <div>{card.ShowContent && <p>{card.Content}</p>}</div>
      </div>
      <div className="white-card-line"></div>
      {card.IsWaitingForNextRound && (
        <span className="white-card-username">{card.SelectedByUsername}</span>
      )}
    </div>
  );
};
