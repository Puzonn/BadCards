import axios from "axios";
import "../Styles/Options.css";
import { OptionsProfileColor } from "./OptionsProfileColor";
import { OptionsLanguageChange } from "./OptionsLanguageChange";
import { t } from "i18next";

export const Options = () => {
  return (
    <>
      <div className="options-container">
        <div className="options-profile">
          <h1>{t("options.profile")}</h1>
          <hr style={{ width: "90%" }}></hr>
          <OptionsLanguageChange></OptionsLanguageChange>
          <hr style={{ width: "50%" }}></hr>
          <OptionsProfileColor></OptionsProfileColor>
          <div style={{height: "8px"}}></div>
        </div>
      </div>
    </>
  );
};
