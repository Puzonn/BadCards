import { AuthContext } from "../../Context/AuthContext";
import { Player } from "../../Types/Player";
import { useContext, useEffect, useState } from "react";
import { ILobby } from "../../Types/Props";
import AddBotIcon from "../../Assets/Icons/robot_icon.svg";

export const Lobby = ({
  Players,
  IsCreator,
  StartGameHandler,
  KickHandler,
  AddBotHandler,
}: ILobby) => {
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
          <div className="flex p-3  w-full font-bold text-sm justify-center items-center">
            <li
              role="presentation"
              className={`text-center cursor-pointer uppercase transition-all hover:opacity-80 ${
                selectedTab === "Players" ? "border-b-2" : ""
              }`}
              onClick={() => setSelectedTab("Players")}
            >
              <a className="block border-x-0 border-t-0 border-transparent px-7">
                Players
              </a>
            </li>
            <li
              onClick={() => setSelectedTab("Rules")}
              role="presentation"
              className={`text-center cursor-pointer transition-all uppercase hover:opacity-80 ${
                selectedTab === "Rules" ? "border-b-2" : ""
              }`}
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
                {Players.map((player: Player, index) => {
                  const rednerKick =
                    player.Username !== User?.username && IsCreator;

                  return (
                    <div
                      key={`lobby_player_${index}`}
                      className={`flex pb-3 pt-2 font-medium pl-4 mt-2 w-full`}
                    >
                      <img
                        className="rounded-full w-10 h-10"
                        src={`https://cdn.discordapp.com/avatars/${player.DiscordUserId}/${player.DiscordAvatarId}.webp?size=100`}
                      />
                      <div
                        className={`text-2xl w-100 max-w-full overflow-hidden mr-4 text-white px-2 ml-4`}
                      >
                        {player.Username}
                      </div>
                      {rednerKick && (
                        <div className="justify-end mr-5 text-xl items-center flex">
                          <button
                            onClick={() => KickHandler(player.UserId)}
                            className="h-10 hover:scale-105 px-3  mr-3 justify-center items-center rounded-md
                           bg-white text-base font-medium text-red-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          >
                            Kick
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div>
                <button
                  className="inline-flex h-10 w-36 border-2 border-black mt-4 hover:scale-105 mr-3 
                  justify-center items-center rounded-md bg-white 
                  text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <div
                    onClick={() => AddBotHandler()}
                    className="flex items-center font-medium"
                  >
                    <img
                      src={AddBotIcon}
                      className="fill-current w-10 h-6 mr-2"
                      alt="Leaderboard Icon"
                    />
                    <span>Add Bot</span>
                  </div>
                </button>
              </div>
              <div className="flex pt-3 justify-center">
                {IsCreator ? (
                  <input
                    onClick={StartGameHandler}
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
