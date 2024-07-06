import axios from "axios";
import { useEffect } from "react";
import { Config } from "../../Config";
import Api from "../../Api";

export const Auth = () => {
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    // Get the value of the 'code' parameter
    const code = searchParams.get("code");

    const params = new URLSearchParams();
    params.append("client_id", process.env.REACT_APP_CLIENT_ID as string);
    params.append(
      "client_secret",
      process.env.REACT_APP_CLIENT_SECRET as string
    );
    params.append("grant_type", "authorization_code");
    params.append("code", code as string);
    params.append("redirect_uri", Config.default.RedirectUri);

    try {
      axios.post("https://discord.com/api/oauth2/token", params).then((e) => {
        const { access_token, token_type } = e.data;

        const authJson = {
          Access_token: access_token,
          Token_type: token_type,
          Expires_in: 32,
        };

        Api.post("auth/discord", authJson).then(() => {
          setTimeout(() => {
            window.location.href = "/start";
          }, 500);
        });
      });
    } catch (ex) {
      console.error(ex);
    }
  }, []);
  return <></>;
};
