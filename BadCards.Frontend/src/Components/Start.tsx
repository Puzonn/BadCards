import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Room } from "../Types/LobbyManagerTypes";
import { LoginForm } from "./Lobby/LoginForm";
import { CreateTab } from "./StartTabs/CreateTab";
import { JoinTab } from "./StartTabs/JoinTab";
import { AboutTab } from "./StartTabs/AboutTab";
import Api from "../Api";
import CreateTabIcon from "../Assets/Icons/plus_icon.png";
import JoinTabIcon from "../Assets/Icons/join_icon.png";
import InfoTabIcon from "../Assets/Icons/info_icon.png";

export const Start = () => {
  const auth = useContext(AuthContext);

  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [infoContent, setInfoContent] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<"Create" | "Join" | "About">(
    "Create"
  );
  const [allowCreate, setAllowCreate] = useState<boolean>(false);

  const [error, setError] = useState("");

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
    return <LoginForm></LoginForm>;
  }

  return (
    <div className="flex flex-col overflow-x-hidden w-screen mt-10 items-center">
      <div>
        {showInfo && (
          <div
            id="alert-1"
            className="flex items-center p-4 mb-4 bg-white rounded text-black font-medium"
            role="alert"
          >
            <svg
              className="flex-shrink-0 w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div className="ms-3 text-sm font-medium">{infoContent}</div>
          </div>
        )}
      </div>
      <div className="md:max-w-5xl w-screen pb-3">
        <div className="bg-white bg-opacity-20 p-3 rounded flex-wrap">
          <ul
            className="mb-5 bg-black rounded text-white list-none"
            role="tablist"
          >
            <div className="py-3 font-bold text-sm px-5 grid grid-cols-3 gap-4">
              <li
                role="presentation"
                className={`text-center cursor-pointer py-1 uppercase transition-all hover:opacity-80 ${
                  selectedTab === "Create" ? "border-b-2" : ""
                }`}
                onClick={() => setSelectedTab("Create")}
              >
                <div className="flex justify-center gap-2 items-center">
                  <img className="w-5" src={CreateTabIcon} />
                  <a className="block border-x-0 border-t-0 border-transparent px-2">
                    Create
                  </a>
                </div>
              </li>
              <li
                role="presentation"
                className={`text-center cursor-pointer transition-all py-1 uppercase hover:opacity-80 ${
                  selectedTab === "Join" ? "border-b-2" : ""
                }`}
                onClick={() => setSelectedTab("Join")}
              >
                <div className="flex justify-center gap-2 items-center">
                  <img className="w-5" src={JoinTabIcon} />
                  <a className="block border-x-0 border-t-0 border-transparent px-2">
                    Join
                  </a>
                </div>
              </li>
              <li
                role="presentation"
                className={`text-center cursor-pointer transition-all py-1 uppercase hover:opacity-80 ${
                  selectedTab === "About" ? "border-b-2" : ""
                }`}
                onClick={() => setSelectedTab("About")}
              >
                <div className="flex justify-center gap-1 items-center">
                  <img className="w-5" src={InfoTabIcon} />
                  <a className="block border-x-0 border-t-0 border-transparent px-2">
                    About
                  </a>
              </div>
              </li>
            </div>
          </ul>
          <div className="mb-6 bottom flex justify-center text-white">
            {selectedTab === "Create" && (
              <div className="opacity-100 w-full duration-150 ease-linear data-[twe-tab-active]:block">
                <CreateTab
                  allowCreate={allowCreate}
                  onSubmit={HandleCreate}
                ></CreateTab>
              </div>
            )}
            {selectedTab === "Join" && (
              <div className="opacity-100 w-full transition-opacity duration-150 ease-linear data-[twe-tab-active]:block">
                <JoinTab onSubmit={HandleJoin} error={error}></JoinTab>
              </div>
            )}
            {selectedTab === "About" && <AboutTab></AboutTab>}
          </div>
        </div>
      </div>
    </div>
  );
};
