import { Alert, Button } from "react-bootstrap";
import { Config } from "../Config";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import "./Styles/Start.css"

export const LoginForm = () => {
  const auth = useContext(AuthContext);
  const HandleDiscordLogin = () => {
    window.location.href = Config.default.OAuth2;
  };

  const HandleGuestLogin = async () => {
    await axios
      .post(`${Config.default.ApiUrl}/auth/guest`)
      .then((response) => {
        if (response.status === 200) {
          window.location.reload();
        }
      })
      .catch(() => {});
  };

  if (auth.IsFetched && auth.IsLoggedIn) {
    return <></>;
  }

  return (
    <>
      <div className="login-form d-flex justify-content-center align-items-center">
        <Alert style={{ width: "75%" }} variant="danger">
          1. Login with Discord: Sign in using your Discord account to unlock
          additional features and connect with your friends seamlessly.
          <br></br>
          2.Continue as Guest: Prefer not to connect your Discord account? No
          problem! You can still access our app's basic functionalities as a
          guest user. Please note that while you can explore the app's features
          as a guest, creating a lobby is only available to users logged in with
          Discord. So, don't miss out on the full experience.
        </Alert>
      </div>
      <Button
        onClick={HandleDiscordLogin}
        style={{ backgroundColor: "#6a86da", fontWeight: "600" }}
        className="border-0 m-2 login-form_button login-form_animation"
      >
        Sign in with Discord
      </Button>
      <br></br>
      <Button
        onClick={HandleGuestLogin}
        style={{ backgroundColor: "var(--bs-primary)", fontWeight: "600" }}
        className="border-0 m-2 login-form_animation"
      >
        Continue as Guest
      </Button>
    </>
  );
};
