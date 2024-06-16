import { AuthContext } from "../../Context/AuthContext";
import useErrorHandler from "../../Hooks/useErrorHandler";
import { Player } from "../../Types/Card";
import { useContext, useState } from "react";

export const Lobby = ({
  players,
  lobbyCode,
  isCreator,
  startGameHandler,
}: {
  players: Player[];
  lobbyCode: string;
  isCreator: boolean;
  startGameHandler: () => void;
}) => {
  const [selectedTab, setSelectedTab] = useState<"Players" | "Rules">(
    "Players"
  );
  const { User } = useContext(AuthContext);

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
                selectedTab === "Players" ? "border-b-2" : ""
              }`}
              onClick={() => setSelectedTab("Players")}
            >
              <a className="block border-x-0 border-t-0 border-transparent px-7">
                Players
              </a>
            </li>
            <li
              role="presentation"
              className={`text-center transition-all uppercase hover:opacity-80 ${
                selectedTab === "Rules" ? "border-b-2" : ""
              }`}
              onClick={() => setSelectedTab("Rules")}
            >
              <a className="block border-x-0  border-t-0 border-transparent px-7">
                Rules
              </a>
            </li>
          </div>
        </ul>
        <div className="mb-6 bottom flex justify-center">
          {selectedTab === "Players" && (
            <div className="w-full duration-150 ease-linear">
              <div className="flex flex-col justify-start w-full items-start bg-black rounded">
                {players.map((player: Player, index) => {
                  const rednerKick =
                    player.Username !== User?.username && isCreator;

                  return (
                    <div
                      key={`lobby_player_${index}`}
                      className={`flex hover:opacity-80 pb-3 pt-2 font-medium pl-4 mt-2 w-full`}
                    >
                      <img
                        className="rounded-full w-10 h-10"
                        src={`https://cdn.discordapp.com/avatars/${player.DiscordUserId}/${player.DiscordAvatarId}.webp?size=100`}
                      />
                      <div className={`text-2xl text-white px-2 ml-4`}>
                        {player.Username}
                      </div>
                      {rednerKick && (
                        <div className="justify-end mr-5 w-full text-xl items-center flex">
                          <button className="text-red-500">Kick</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex pt-3 justify-center">
                {isCreator ? (
                  <input
                    onClick={startGameHandler}
                    type="button"
                    className={`rounded-lg mt-4 py-4 px-10 text-center align-middle text-1xl hover:scale-105 
                  font-bold text-white shadow-md transition-all bg-black`}
                    value="Start Game"
                  />
                ) : (
                  <div className="text-2xl font-medium">
                    Waiting For Creator
                  </div>
                )}
              </div>
            </div>
          )}
          {selectedTab === "Rules" && (
            <div className="opacity-100 w-full transition-opacity duration-150 ease-linear data-[twe-tab-active]:block"></div>
          )}
        </div>
      </div>
    </div>
  );
};
