import axios from "axios";
import "../Styles/Options.css";
import { Config } from "../../Config";
import useErrorHandler from "../../Hooks/useErrorHandler";
import { OptionsProfileColor } from "./OptionsProfileColor";

export const Options = () => {

  return (
    <>
      <div className="options-container">
        <div className="options-profile">
          <h1>Profile</h1>
          <hr style={{ width: "90%" }}></hr>
            <OptionsProfileColor></OptionsProfileColor>
          <hr style={{ width: "50%" }}></hr>
        </div>
      </div>
    </>
  );
};
