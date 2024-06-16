import { ILeaderboard } from "../Types/LobbyManagerTypes";
import "./Styles/Leaderboard.css";
import WinIcon from "../Assets/Icons/win_icon.svg";
import LeaderboardIcon from "../Assets/Icons/leaderboard_icon.svg";

export const Leaderboard = ({
  Players,
  IsLeaderboardOpen,
  JudgeUsername,
  OnToggleLeaderboard,
}: ILeaderboard) => {
  return (
    <>
      {IsLeaderboardOpen && (
        <div className="flex flex-col w-full pt-1 min-h-screen h-full bg-black shadow-lg shadow-slate-100">
          <div className="pl-2 mb-3 flex justify-between">
            <span className="text-white text-2xl font-medium">Players:</span>
            <button
              onClick={OnToggleLeaderboard}
              className="inline-flex h-10 hover:scale-105 md:hidden mr-3 justify-center items-center rounded-md bg-white 
             text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <img
                className="w-full px-3 py-2 h-full object-cover"
                src={LeaderboardIcon}
                alt="Leaderboard Icon"
              />
            </button>
          </div>
          {Players.map((player, index) => {
            const isJudge = player.Username === JudgeUsername;
            return (
              <div key={index} className="flex flex-col w-full mb-2">
                <div className="flex relative items-center text-white font-medium pl-2">
                  <img
                    className={`rounded-full w-10 h-10 object-cover ${
                      isJudge ? "border-2 border-yellow-300" : ""
                    }`}
                    src={`https://cdn.discordapp.com/avatars/${player.DiscordUserId}/${player.DiscordAvatarId}.webp?size=100`}
                  />
                  <div className="p-2 overflow-x-hidden mr-3">
                    {player.Username}
                  </div>
                  <div className="flex-grow"></div>
                  <div className="font-bold text-white text-lg pr-2">0</div>
                  <img className="w-5 h-5 mr-3" src={WinIcon} />
                </div>
                <hr className="border-white mt-2"></hr>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
