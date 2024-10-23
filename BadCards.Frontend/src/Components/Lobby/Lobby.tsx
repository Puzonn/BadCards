import { AuthContext } from "../../Context/AuthContext";
import { Player } from "../../Types/Player";
import { useContext, useEffect, useState } from "react";
import { ILobby } from "../../Types/Props";
import AddBotIcon from "../../Assets/Icons/robot_icon-white.png";
import PlayIcon from "../../Assets/Icons/play_icon.png";
import ExitIcon from "../../Assets/Icons/join_icon.png";
import DropdownIcon from "../../Assets/Icons/dropdown_icon.png";
export const Lobby = ({
  Players,
  IsCreator,
  StartGameHandler,
  KickHandler,
  AddBotHandler,
  EndGame,
  LeaveGame,
}: ILobby) => {
  const [selectedTab, setSelectedTab] = useState<"Players" | "Rules">(
    "Players"
  );
  const [playerDropdown, setPlayerDropdown] = useState<Player | undefined>(
    undefined
  );

  const { User } = useContext(AuthContext);

  const HandleLeave = async () => {
    if (IsCreator) {
      await EndGame();
    } else {
      await LeaveGame();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-3 min-h-96">
      <div className="flex text-white justify-between text-center gap-3 text-xl">
        <div
          className={`hover:bg-accent hover:bg-opacity-50 p-2 cursor-pointer flex items-center gap-2`}
        >
          <span>Players</span>
        </div>
        <div
          className={`hover:bg-accent hover:bg-opacity-50 p-2 cursor-pointer flex items-center gap-2`}
        >
          <span>Rules</span>
        </div>
      </div>
      
      {IsCreator && (
        <div>
          <button
            onClick={StartGameHandler}
            className="text-2xl text-white bg-accent px-8 py-2 rounded hover:bg-opacity-80"
          >
            Start Game
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {Players.map((player, index) => {
          return (
            <div key={`player-${index}`} className="text-white gap-3 text-xl">
              <div className="flex gap-3">
                <img
                  className="rounded-full w-10 h-10"
                  src={`https://cdn.discordapp.com/avatars/${player.DiscordUserId}/${player.DiscordAvatarId}.webp?size=100`}
                />
                <span>{player.Username}</span>

                <div
                  onClick={() => setPlayerDropdown(player)}
                  className="ml-auto cursor-pointer"
                >
                  <img src={DropdownIcon} className="w-8" />
                </div>
              </div>

              {playerDropdown?.UserId === player.UserId && (
                <div className="flex flex-col gap-3">
                  <button className="text-orange-500">Promote</button>
                  <button className="text-red-500">Kick</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
