import { useContext, useEffect, useState } from "react";
import "./Styles/LobbyManager.css";
import { Room } from "../Types/LobbyManagerTypes";
import { AuthContext } from "../Context/AuthContext";
import { useTranslation } from "react-i18next";
import axios from "axios";

export const LobbyManager = () => {
  const [lobbyCodeInput, setLobbyCodeInput] = useState<string>("");
  const [badLobbyCodeRequest, setBadLobbyCodeRequest] = useState(false);

  const user = useContext(AuthContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (user.IsFetched && !user.IsLoggedIn) {
      window.location.href = "/start";
    }
  }, [user]);

  const TryJoin = (lobbyCode: string) => {
    (async function () {
      axios
        .post(`https://localhost:7083/game/join?lobbyCode=${lobbyCode}`)
        .then((response) => {
          if (response.status !== 200) {
            return;
          }
          const room = response.data as Room;
          window.location.href = `/lobby?code=${room.LobbyCode}`;
        })
        .catch((err) => {
          setBadLobbyCodeRequest(true);
        });
    })();
  };

  const Create = () => {
    (async function () {
      await fetch(`https://localhost:7083/game/create`, {
        method: "POST",
        credentials: "include",
      }).then((response) => {
        response.json().then((x) => {
          const room = x as Room;
          TryJoin(room.LobbyCode);
        });
      });
    })();
  };

  if (user.IsLoggedIn && user.IsFetched) {
    return (
      <div className="lobby-manager">
        <div className="lobby-manager-opt">
          <input
            maxLength={8}
            className="lobby-manager-code-input"
            onChange={(e) => setLobbyCodeInput(e.target.value)}
            placeholder={t("dashboard.lobby-code")}
          ></input>
          {badLobbyCodeRequest && (
            <span style={{ color: "#c51244" }}>
              {t("dashboard.error-bad-code")}
            </span>
          )}
          <button
            className="lobby-manager-join"
            type="submit"
            onClick={() => TryJoin(lobbyCodeInput)}
          >
            {t("dashboard.join-lobby")}
          </button>
          <hr className="lobby-manager-create-line"></hr>
          <button
            className="lobby-manager-create"
            type="submit"
            onClick={Create}
          >
            {t("dashboard.create-lobby")}
          </button>
        </div>
      </div>
    );
  }
  return <></>;
};
