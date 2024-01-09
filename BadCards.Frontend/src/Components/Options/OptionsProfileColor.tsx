import { useContext, useEffect, useState } from "react";
import { Config } from "../../Config";
import axios from "axios";
import "../Styles/Options.css";
import { AuthContext } from "../../Context/AuthContext";

export const OptionsProfileColor = () => {
  const auth = useContext(AuthContext);

  const [error, setError] = useState("");
  const [state, setState] = useState<"NONE" | "ROLLING">("NONE");

  const ChangeChangeProfileColor = () => {
    axios
      .patch(`${Config.default.ApiUrl}/user/randomize-avatar-color`)
      .then((res) => {
        setState("ROLLING");
        auth.UpdateUser();
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };

  return (
    <>
      <h2>Change Profile Color</h2>
      <span>You can your randomize color once a day !</span>
      <br></br>
      {error !== "" && (
        <>
          <span style={{ color: "red" }}>{error}</span>
          <br></br>
        </>
      )}
      {state === "NONE" && (
        <button className="options-gradient" onClick={ChangeChangeProfileColor}>Randomize Color</button>
      )}
      {state === "ROLLING" && (
        <>
          <h2 className="">Congratulations !</h2>
          <h2 style={{ color: `#${auth.User?.ProfileColor}` }}>
            You rolled #{auth.User?.ProfileColor}
          </h2>
        </>
      )}
    </>
  );
};
