import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import { Room } from "../Types/LobbyManagerTypes";
import { Config } from "../Config";
import { LoginForm } from "./Lobby/LoginForm";
import { CreateTab } from "./StartTabs/CreateTab";
import { JoinTab } from "./StartTabs/JoinTab";
import { useNavigate } from "react-router-dom";

export const Start = () => {
  const auth = useContext(AuthContext);

  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [infoContent, setInfoContent] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<"Create" | "Join" | "Help">(
    "Create"
  );
  const [allowCreate, setAllowCreate] = useState<boolean>(false);

  const [error, setError] = useState("");

  useEffect(() => {
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
  });

  useEffect(() => {
    axios.defaults.withCredentials = true;
    (async function () {
      try {
        await axios
          .get(`${Config.default.ApiUrl}/game/create-role-check`, {
            headers: {
              "Content-Type": "application/json",
            },
            validateStatus: (status) =>
              (status >= 200 && status < 300) || status === 500,
          })
          .then((response) => {
            console.log(response.data);
            setAllowCreate(response.data);
          });
      } catch (ex) {}
    })();
  }, []);

  const HandleJoin = async (
    lobbyCode: string | undefined,
    password: string | undefined
  ) => {
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
          setError("Lobby dose not exist, or password is incorrect.");
        });
    })();
  };

  const HandleCreate = async (password: string) => {
    try {
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
    } catch (x) {}
  };

  if (!auth.IsFetched) {
    return <></>;
  }

  if (auth.IsFetched && !auth.IsLoggedIn) {
    return <LoginForm></LoginForm>;
  }

  return (
    <div className="flex flex-col w-screen mt-10 items-center">
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
      <div className="bg-white bg-opacity-20 md:w-1/2 w-screen p-3 rounded">
        <ul
          className="mb-5 flex bg-black rounded text-white list-none flex-row flex-wrap border-b-0 ps-0"
          role="tablist"
        >
          <div className="flex p-3 w-full font-bold text-sm justify-center items-center">
            <li
              role="presentation"
              className={`text-center uppercase transition-all hover:opacity-80 ${
                selectedTab === "Create" ? "border-b-2" : ""
              }`}
              onClick={() => setSelectedTab("Create")}
            >
              <a className="block cursor-pointer border-x-0 border-t-0 border-transparent px-7">
                Create
              </a>
            </li>
            <li
              role="presentation"
              className={`text-center transition-all uppercase hover:opacity-80 ${
                selectedTab === "Join" ? "border-b-2" : ""
              }`}
              onClick={() => setSelectedTab("Join")}
            >
              <a className="block cursor-pointer border-x-0 border-t-0 border-transparent px-7">
                Join
              </a>
            </li>
            <li
              role="presentation"
              className={`text-center transition-all uppercase hover:opacity-80 ${
                selectedTab === "Help" ? "border-b-2" : ""
              }`}
              onClick={() => setSelectedTab("Help")}
            >
              <a className="block cursor-pointer border-x-0 border-t-0 border-transparent px-7">
                Help
              </a>
            </li>
          </div>
        </ul>
        <div className="mb-6 bottom flex justify-center text-white">
          {selectedTab === "Create" && (
            <div className="opacity-100 w-full duration-150 ease-linear data-[twe-tab-active]:block">
              <CreateTab allowCreate={allowCreate} onSubmit={HandleCreate}></CreateTab>
            </div>
          )}
          {selectedTab === "Join" && (
            <div className="opacity-100 w-full transition-opacity duration-150 ease-linear data-[twe-tab-active]:block">
              <JoinTab onSubmit={HandleJoin} error={error}></JoinTab>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
