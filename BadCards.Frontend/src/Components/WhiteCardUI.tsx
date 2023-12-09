import { IWhiteCardUI } from "../Types/Card";
import "./Styles/WhiteCard.css";

export const WhiteCardUI = ({
  StateCardClicked,
  CardId,
  Content,
  IsSelected,
  HasSelectedRequired,
  IsJudge,
}: IWhiteCardUI) => {
  const HandleCardClick = (cardId: number) => {
    if (!IsSelected || IsJudge) {
      StateCardClicked!(cardId);
    }
  };

  return (
    <div
      onClick={() => {
        HandleCardClick(CardId);
      }}
      className="container"
    >
      <div style={{opacity: IsJudge || HasSelectedRequired ? '0.6' : ''}} className={`white-card white-card-full-rounded ${IsSelected && !IsJudge ? "selected" : ""}`}>
        <div className="white-card-question">
          <p>{Content}</p>
        </div>
        <div className="white-card-line"></div>
      </div>
    </div>
  );
};
