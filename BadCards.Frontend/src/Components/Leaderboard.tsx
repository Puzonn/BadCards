import { ILeaderboard } from "../Types/LobbyManagerTypes";
import "./Styles/Leaderboard.css";

export const Leaderboard = ({ Players }: ILeaderboard) => {
  const sortedPlayers = Players.sort((a, b) => b.Points - a.Points);

  return (
    <div className="leaderboard-container">
      <span className="leaderboard-name">Leaderboard</span>
      <ul>
        {sortedPlayers.map((player, index) => {
          return (
            <li key={`leaderboard_${index}`}>
              <img
                style={{ borderColor: `#${player.AvatarColor}` }}
                alt="UserDiscordAvatar"
                src={`https://cdn.discordapp.com/avatars/${player.DiscordUserId}/${player.DiscordAvatarId}.webp?size=64`}
              ></img>
              <span style={{ color: `#${player.AvatarColor}` }}>
                {player.Username.substring(0, 12)}
              </span>
              <span className="leaderboard-points">{player.Points}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
