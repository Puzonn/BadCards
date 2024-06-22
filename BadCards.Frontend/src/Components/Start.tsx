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
  const [selectedTab, setSelectedTab] = useState<"Create" | "Join" | "About">(
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
      <div className="md:w-1/2 w-screen pb-3">
        <div className="bg-white bg-opacity-20 p-3 rounded">
          <ul
            className="mb-5 flex bg-black rounded text-white list-none flex-row justify-center flex-wrap"
            role="tablist"
          >
            <div className="flex p-3 font-bold text-sm justify-center items-center">
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
                  selectedTab === "About" ? "border-b-2" : ""
                }`}
                onClick={() => setSelectedTab("About")}
              >
                <a className="block cursor-pointer border-x-0 border-t-0 border-transparent px-7">
                  About
                </a>
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
            {selectedTab === "About" && (
              <div className="container text-black mx-auto px-4">
                <h1 className="text-4xl font-bold text-center">
                  How to Play Cards Against Humanity
                </h1>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-bold mb-4">Objective</h2>
                  <p className="mb-6">
                    The objective of Cards Against Humanity is to have the most
                    hilarious or outrageous card combinations and win the most
                    rounds.
                  </p>

                  <h2 className="text-2xl font-bold mb-4">Setup</h2>
                  <ul className="list-disc list-inside mb-6">
                    <li>Each player draws 10 white cards.</li>
                    <li>
                      One player is selected to be the Judge for the first
                      round.
                    </li>
                  </ul>

                  <h2 className="text-2xl font-bold mb-4">Gameplay</h2>
                  <ol className="list-decimal list-inside mb-6">
                    <li>The Judge draws a black card and reads it out loud.</li>
                    <li>
                      Everyone else answers the question or fills in the blank
                      by passing one white card to the Judge, face down.
                    </li>
                    <li>
                      The Judge shuffles all the answers and shares each card
                      combination with the group.
                    </li>
                    <li>
                      The Judge picks the funniest play, and whoever submitted
                      it gets one point.
                    </li>
                    <li>
                      After the round, a new player becomes the Judge, and
                      everyone draws back up to 10 white cards.
                    </li>
                  </ol>

                  <h2 className="text-2xl font-bold mb-4">Winning the Game</h2>
                  <p className="mb-6">
                    The game continues until you decide to stop. The player with
                    the most points at the end wins.
                  </p>

                  <h2 className="text-2xl font-bold mb-4">House Rules</h2>
                  <p className="mb-6">
                    Feel free to make your own house rules to add more fun or
                    twists to the game!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
