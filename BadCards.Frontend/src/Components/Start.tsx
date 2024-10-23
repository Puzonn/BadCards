import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Room } from "../Types/LobbyManagerTypes";
import Api from "../Api";
import CreateTabIcon from "../Assets/Icons/plus_icon.png";
import JoinTabIcon from "../Assets/Icons/join_icon.png";
import CreateLobbyIcon from "../Assets/Icons/play_icon.png";

export const Start = () => {
  const auth = useContext(AuthContext);

  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [infoContent, setInfoContent] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<"Create" | "Join" | "About">(
    "Join"
  );
  const [allowCreate, setAllowCreate] = useState<boolean>(false);
  const [error, setError] = useState("");

  const [lobbyCodeInput, setLobbyCodeInput] = useState<string>("");
  const [lobbyPasswordInput, setLobbyPasswordInput] = useState<string>("");

  useEffect(() => {
    Api.get("game/create-role-check").then((response) => {
      setAllowCreate(response.data);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const gameEndedParm = urlParams.get("gameEnded");
    const code = urlParams.get("code");

    if (code !== null && auth.IsFetched && !auth.IsLoggedIn) {
      localStorage.setItem("after-login-redirect-url", code);
    }

    const storedCode = localStorage.getItem("after-login-redirect-url");

    if (storedCode !== null && auth.IsFetched && auth.IsLoggedIn) {
      localStorage.removeItem("after-login-redirect-url");
      window.location.href = `/lobby?code=${storedCode}`;
    }

    if (gameEndedParm) {
      setInfoContent("Game ended successfully.");
      setShowInfo(true);

      return;
    }

    const gameLeaveParm = urlParams.get("gameEnded");
    if (gameLeaveParm) {
      setInfoContent("Game left successfully.");
      setShowInfo(true);

      return;
    }

    const kickParm = urlParams.get("kick");
    if (kickParm) {
      setInfoContent("You've been kicked.");
      setShowInfo(true);
      return;
    }
  }, []);

  const HandleJoin = async (
    lobbyCode: string | undefined,
    password: string | undefined
  ) => {
    const data = {
      LobbyCode: lobbyCode,
      Password: password,
    };

    Api.post("game/join", data).then((response) => {
      if (response.status !== 200) {
        return;
      }
      const room = response.data as Room;
      window.location.href = `/lobby?code=${room.LobbyCode}`;
    });
  };

  const HandleCreate = async (password: string) => {
    Api.post("game/create")
      .then((response) => {
        HandleJoin((response.data as Room).LobbyCode, undefined);
      })
      .catch(() => {
        console.error("Error while creating a lobby");
      });
  };

  if (!auth.IsFetched) {
    return <></>;
  }

  if (auth.IsFetched && !auth.IsLoggedIn) {
    return <div></div>;
  }

  return (
    <div className="flex flex-col justify-center items-center w-screen min-h-96">
      <div className="flex flex-col gap-3">
        <div className="flex text-white justify-between text-center gap-3 text-xl">
          <div
            onClick={() => setSelectedTab("Create")}
            className={`hover:bg-accent hover:bg-opacity-50 p-2 cursor-pointer flex items-center gap-2 ${
              selectedTab === "Create" ? "bg-accent" : ""
            }`}
          >
            <img className="w-8" src={CreateTabIcon}></img>
            <span>New Game</span>
          </div>
          <div
            onClick={() => setSelectedTab("Join")}
            className={`hover:bg-accent hover:bg-opacity-50 p-2 cursor-pointer flex items-center gap-2 ${
              selectedTab === "Join" ? "bg-accent" : ""
            }`}
          >
            <img className="w-8" src={JoinTabIcon}></img>
            <span>Join Game</span>
          </div>
        </div>

        <div>
          {selectedTab === "Create" && (
            <div className="flex gap-3">
              <input
                placeholder="Lobby Name"
                className="outline-none bg-accent bg-opacity-50 text-white placeholder:text-gray-300 p-2 placeholder:text-xl font-semibold text-xl"
              />
              <div
                onClick={() => HandleCreate("")}
                className="bg-accent hover:scale-105 cursor-pointer w-10 flex items-center justify-center"
              >
                <img className="w-6" src={CreateLobbyIcon} />
              </div>
            </div>
          )}

          {selectedTab === "Join" && (
            <div className="flex gap-3 flex-col">
              <div className="flex gap-3">
                <input
                  onChange={(e) => setLobbyCodeInput(e.target.value)}
                  placeholder="Lobby Code"
                  className="outline-none bg-accent bg-opacity-50 text-white placeholder:text-gray-300 p-2 placeholder:text-xl font-semibold text-xl"
                />
              </div>
              <div className="flex gap-3">
                <input
                  onChange={(e) => setLobbyPasswordInput(e.target.value)}
                  placeholder="Password?"
                  className="outline-none bg-accent bg-opacity-50 text-white placeholder:text-gray-300 p-2 placeholder:text-xl font-semibold text-xl"
                />
                <div
                  onClick={() => HandleJoin(lobbyCodeInput, lobbyPasswordInput)}
                  className="bg-accent hover:scale-105 cursor-pointer w-10 flex items-center justify-center"
                >
                  <img className="w-6" src={CreateLobbyIcon} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
