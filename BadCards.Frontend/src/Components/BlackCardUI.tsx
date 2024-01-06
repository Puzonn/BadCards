import userEvent from "@testing-library/user-event";
import { Card, FormattedBlackCardContent } from "../Types/Card";
import "./Styles/BlackCard.css";
import { useEffect } from "react";

export const BlackCardUI = ({ Content }: Card) => {
  function FormatString(content: string): FormattedBlackCardContent[] {
    const splitted = content.split("_");
    const formatElements: FormattedBlackCardContent[] = [];

    splitted.forEach((x, index) => {
      formatElements.push({ FormattedContent: x, Class: "" });
      if (index !== splitted.length - 1) {
        formatElements.push({ FormattedContent: "___", Class: "" });
      }
    });
    console.log("FormatString ", formatElements);
    return formatElements;
  }
  
  return (
    <div className="container">
      <div className="black-card">
        <div className="black-card-question">
         {Content}
        </div>
        <div className="black-card-line"></div>
      </div>
    </div>
  );
};
