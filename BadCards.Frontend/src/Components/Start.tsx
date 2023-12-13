import "./Styles/Start.css";
import { FormEvent, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import { Room } from "../Types/LobbyManagerTypes";
import { loadavg } from "os";

export const Start = () => {
  const [guidelineAccepeted, setGuidelineAccpeted] = useState(false);
  const [tabBarIndex, setTabBarIndex] = useState(0);
  const [error, setError] = useState("");
  const auth = useContext(AuthContext);
  const { t } = useTranslation();

  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  const HandleLogin = (e: any) => {
    e.preventDefault();

    if (!guidelineAccepeted) {
      return;
    }

    window.location.href = process.env.REACT_APP_DEFAULT_OAuth2 as string;
  };

  const HandleJoin = (lobbyCode: string, password: string | undefined) => {
    const data = {
      LobbyCode: lobbyCode,
      Password: password,
    };

    (async function () {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/game/join`,
          JSON.stringify(data),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response.status !== 200) {
            return;
          }
          const room = response.data as Room;
          window.location.href = `/lobby?code=${room.LobbyCode}`;
        })
        .catch((err) => {
          setError("Lobby dose not exist, or password is incorrect");
        });
    })();
  };

  const HandleCreate = async (password: string) => {
    (async function () {
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}/game/create`,
          JSON.stringify(password),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          const response = res.data as Room;
          HandleJoin(response.LobbyCode, undefined);
        });
    })();
  };

  const HandleJoinClick = (provider: FormEvent) => {
    provider.preventDefault();
    const password = (document.getElementById("lobby_password") as any).value;
    const gameCode = (document.getElementById("lobby_game_code") as any).value;
    HandleJoin(gameCode, password);
  };

  const HandleCreateClick = () => {
    const password = (document.getElementById("lobby_password") as any).value;
    HandleCreate(password);
  };

  return (
    <div className="auth-container">
      <div className="tab-bar">
        <button
          onClick={() => setTabBarIndex(0)}
          className={tabBarIndex === 0 ? `tab-bar_active` : ""}
        >
          Create Game
        </button>
        <button
          onClick={() => setTabBarIndex(1)}
          className={tabBarIndex === 1 ? `tab-bar_active` : ""}
        >
          Join Game
        </button>
        <button
          onClick={() => setTabBarIndex(2)}
          className={tabBarIndex === 2 ? `tab-bar_active` : ""}
        >
          About
        </button>
      </div>
      {tabBarIndex === 0 && auth.IsLoggedIn && (
        <>
          <input
            id="lobby_password"
            type="password"
            className="tab-bar-password"
            placeholder="Password"
          ></input>
          <p className="tab-bar-note">Password is optional</p>
          <br></br>
          <button
            id="lobby_game_code"
            onClick={HandleCreateClick}
            type="button"
            className="tab-bar-submit"
          >
            Create Game
          </button>
        </>
      )}
      {tabBarIndex === 1 && auth.IsLoggedIn && (
        <form onSubmit={HandleJoinClick}>
          <input
            type="text"
            id="lobby_game_code"
            className="tab-bar-password"
            placeholder="Game Code"
          ></input>
          <br></br>
          <input
            id="lobby_password"
            type="password"
            className="tab-bar-password"
            placeholder="Password"
          ></input>
          <p className="tab-bar-note">Password is optional</p>
          <p style={{ color: "orangered" }}>{error}</p>
          <br></br>
          <button
            onClick={HandleJoinClick}
            type="button"
            className="tab-bar-submit"
          >
            Join Game
          </button>
        </form>
      )}
      {!auth.IsLoggedIn && (
        <form onSubmit={HandleLogin}>
          <div className="auth-discord-signup">
            <button type="submit">{t("login.signin-with-discord")}</button>
          </div>
          <div className="auth-signup-warning">
            <label>
              <input
                required
                onChange={(e) => {
                  setGuidelineAccpeted(e.target.checked);
                }}
                checked={guidelineAccepeted}
                type="checkbox"
                name="guideline-accepted"
              />
              {t("login.age-verification")}
            </label>
          </div>
        </form>
      )}
      <hr style={{ color: "#191A21", width: "60%" }}></hr>
    </div>
  );
};
