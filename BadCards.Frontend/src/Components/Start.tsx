import "./Styles/Start.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import { Room } from "../Types/LobbyManagerTypes";
import { Config } from "../Config";
import { LoginForm } from "./Lobby/LoginForm";
import { CreateTab } from "./StartTabs/CreateTab";
import { JoinTab } from "./StartTabs/JoinTab";

export const Start = () => {
  const auth = useContext(AuthContext);

  const [selectedTab, setSelectedTab] = useState<"Create" | "Join" | "Help">(
    "Create"
  );

  const [error, setError] = useState("");

  useEffect(() => {
    axios.defaults.withCredentials = true;
    (async function () {
      await axios
        .get(`${Config.default.ApiUrl}/user/game-pending-status`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .catch(() => {});
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
              <a className="block border-x-0 border-t-0 border-transparent px-7">
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
              <a className="block border-x-0  border-t-0 border-transparent px-7">
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
              <a className="block border-x-0 border-t-0 border-transparent px-7">
                Help
              </a>
            </li>
          </div>
        </ul>
        <div className="mb-6 bottom flex justify-center text-white">
          {selectedTab === "Create" && (
            <div className="opacity-100 w-full duration-150 ease-linear data-[twe-tab-active]:block">
              <CreateTab onSubmit={HandleCreate}></CreateTab>
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