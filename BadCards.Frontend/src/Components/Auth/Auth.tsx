import axios from "axios";
import { useEffect } from "react";
import { Config } from "../../Config";

export const Auth = () => {
  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));

    const auth = [
      fragment.get("access_token"),
      fragment.get("token_type"),
      fragment.get("expires_in"),
    ];

    if (typeof auth === "undefined") {
      window.location.href = "/";
      return;
    }

    const authJson = {
      Access_token: auth[0],
      Token_type: auth[1],
      Expires_in: auth[2],
    };

    axios.defaults.withCredentials = true;
    axios
      .post(
        `${Config.default.ApiUrl}/auth/discord`,
        JSON.stringify(authJson),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        setTimeout(() => {
          window.location.href = "/start";
        }, 500)
      });
  }, []);
  return <></>;
};
