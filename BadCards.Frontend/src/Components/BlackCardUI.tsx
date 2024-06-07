import { Card, FormattedBlackCardContent } from "../Types/Card";
import "./Styles/BlackCard.css";

export const BlackCardUI = ({ Content }: Card) => {
  function FormatContent(content: string): string {
    const indexes: number[] = [];

    for (let i = 0; i < Content.length; i++) {
      if (Content[i] == "_") {
        indexes.push(i);
      }
    }
    let newContent = "";

    indexes.forEach((index) => {
      newContent = Content.slice(0, index) + "____" + Content.slice(index);
    });

    return newContent;
  }

  return (
    <div className="container">
      <div className="black-card">
        <div className="black-card-question">{FormatContent(Content)}</div>
        <div className="black-card-line"></div>
      </div>
    </div>
  );
};
