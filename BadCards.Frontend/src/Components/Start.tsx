import "./Styles/Start.css";
import { FormEvent, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import { Room } from "../Types/LobbyManagerTypes";
import { Config } from "../Config";

export const Start = () => {
  const [guidelineAccepeted, setGuidelineAccepted] = useState(false);
  const [tabBarIndex, setTabBarIndex] = useState<"CREATE" | "JOIN" | "ABOUT">(
    "CREATE"
  );
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

    window.location.href = Config.default.OAuth2;
  };

  const HandleJoin = (lobbyCode: string, password: string | undefined) => {
    const data = {
      LobbyCode: lobbyCode,
      Password: password,
    };

    (async function () {
      axios
        .post(`${Config.default.ApiUrl}/game/join`, JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
          },
        })
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
          `${Config.default.ApiUrl}/game/create`,
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

  const HandleCreateClick = (provider: FormEvent) => {
    provider.preventDefault();
    const password = (document.getElementById("lobby_password") as any).value;
    HandleCreate(password);
  };

  return (
    <div className="auth-container">
      <div className="tab-bar">
        <button
          onClick={() => setTabBarIndex("CREATE")}
          className={tabBarIndex === "CREATE" ? `tab-bar_active` : ""}
        >
          Create Game
        </button>
        <button
          onClick={() => setTabBarIndex("JOIN")}
          className={tabBarIndex === "JOIN" ? `tab-bar_active` : ""}
        >
          Join Game
        </button>
        <button
          onClick={() => setTabBarIndex("ABOUT")}
          className={tabBarIndex === "ABOUT" ? `tab-bar_active` : ""}
        >
          About
        </button>
      </div>
      {tabBarIndex === "CREATE" && auth.IsLoggedIn && (
        <form onSubmit={HandleCreateClick}>
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
        </form>
      )}
      {tabBarIndex === "JOIN" && auth.IsLoggedIn && (
        <form autoComplete="off" onSubmit={HandleJoinClick}>
          <input
            type="text"
            id="lobby_game_code"
            className="tab-bar-password"
            placeholder="Game Code"
            autoComplete="off"
          ></input>
          <br></br>
          <input
            id="lobby_password"
            type="password"
            className="tab-bar-password"
            placeholder="Password"
            autoComplete="off"
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
      {tabBarIndex === "ABOUT" && (
        <div>
          <p style={{ fontSize: "20px" }}>{t("about.how-to-play")}</p>
          <span>{t("about.how-to-play-note")}</span>
          <p style={{ fontSize: "20px" }}>{t("about.disclaimer")} </p>
          <span>
            {t('about.disclaimer-note')}
          </span>
        </div>
      )}
      {!auth.IsLoggedIn && tabBarIndex !== "ABOUT" && (
        <form onSubmit={HandleLogin}>
          <div className="auth-discord-signup">
            <button type="submit">{t("login.signin-with-discord")}</button>
          </div>
          <div className="auth-signup-warning">
            <label>
              <input
                required
                onChange={(e) => {
                  setGuidelineAccepted(e.target.checked);
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
