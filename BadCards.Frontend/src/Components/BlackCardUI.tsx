import userEvent from "@testing-library/user-event";
import { Card, FormattedBlackCardContent } from "../Types/Card";
import "./Styles/BlackCard.css";
import { useEffect } from "react";

export const BlackCardUI = ({ Content }: Card) => {
 // const formattedString: FormattedBlackCardContent[] = FormatString(Content);

  function FormatString(content: string): FormattedBlackCardContent[] {
    console.info("FormatString original", Content);
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

useEffect(() => {
  console.log(Content)
})

  /*
   {formattedString.map((x, index) => {
            return (
              <span key={`black_card_format_${index}`} className={x.Class}>
                {x.FormattedContent}
              </span>
            );
          })}
 */
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
