import { Button } from "react-bootstrap";
import { Player } from "../../Types/Card";

export const PlayersTab = ({
  lobbyCode,
  players,
  isCreator,
}: {
  lobbyCode: string;
  players: Player[];
  isCreator: boolean;
}) => {
  return (
    <div className="tab-box">
      <span
        style={{
          fontWeight: "600",
          marginTop: "40px",
          paddingBottom: "8px",
          width: "70vw",
        }}
      >
        {lobbyCode}
      </span>
      {players.map((player, index) => {
        const hideLine = index === players.length - 1;
        const hideKick = index === 0;

        return (
          <div style={{ height: 70 }} key={`lobby_player_${index}`}>
            <div
              style={{
                fontWeight: "600",
                marginTop: "5px",
                display: "flex",
                padding: "10px 10px 10px 10px",
                marginLeft: "1%",
                marginRight: "1%",
                borderRadius: "10px",
              }}
            >
              <div className="text-start">
                <img
                  className="rounded-circle"
                  style={{ width: "45px" }}
                  src={`https://cdn.discordapp.com/avatars/${player.DiscordUserId}/${player.DiscordAvatarId}.webp?size=64`}
                ></img>
                <span
                  style={{ color: `#${player.ProfileColor}` }}
                  className="fs-4 m-2"
                >
                  {player.Username}
                </span>
              </div>
              {isCreator && !hideKick && (
                <Button variant="danger" style={{ margin: "auto 0 auto auto" }}>
                  Kick
                </Button>
              )}
            </div>
            {!hideLine && (
              <hr
                style={{
                  height: "1px",
                  width: "100%",
                  padding: 0,
                  margin: 0,
                }}
                color="white"
              ></hr>
            )}
          </div>
        );
      })}
      {(players.length >= 2 && !isCreator) && <h4 className="m-3"> Waiting for creator. </h4>}
    </div>
  );
};
