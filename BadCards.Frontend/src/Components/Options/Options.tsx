import "../Styles/Options.css";
import { OptionsProfileColor } from "./OptionsProfileColor";
import { OptionsLanguageChange } from "./OptionsLanguageChange";
import { t } from "i18next";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

export const Options = () => {
  const auth = useContext(AuthContext);

  return (
    <>
      <div className="options-container">
        <div className="d-flex">
          <img
            onClick={() => {
              window.location.href = "/options";
            }}
            src={`https://cdn.discordapp.com/avatars/${auth.User?.discordId}/${auth.User?.avatarId}.webp?size=256`}
            alt="User Avatar"
            style={{
              padding: "4px",
              width: "100px",
              height: "100px",
            }}
          />
          <h4>{auth.User?.username}</h4>
          <br></br>
          <h4>{auth.User?.username}</h4>
        </div>
        <div className="options-profile tab-box">
          <h1>{t("options.profile")}</h1>
          <hr style={{ width: "90%" }}></hr>
          <OptionsLanguageChange></OptionsLanguageChange>
          <hr style={{ width: "50%" }}></hr>
          <OptionsProfileColor></OptionsProfileColor>
          <div style={{ height: "8px" }}></div>
        </div>
      </div>
    </>
  );
};
