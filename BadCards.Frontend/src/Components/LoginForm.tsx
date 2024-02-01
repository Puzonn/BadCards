import { Button } from "react-bootstrap";
import { Config } from "../Config";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

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
      <Button
        onClick={HandleDiscordLogin}
        style={{ backgroundColor: "#6a86da", fontWeight: '600' }}
        className="border-0 m-2"
      >
        Sign in with Discord
      </Button>
      <br></br>
      <Button
        onClick={HandleGuestLogin}
        style={{ backgroundColor: "var(--bs-primary)", fontWeight: '600' }}
        className="border-0 m-2"
      >
        Continue as Guest
      </Button>
    </>
  );
};
