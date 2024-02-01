import { Button, Tab, Tabs } from "react-bootstrap";
import { Player } from "../Types/Card";

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
  return (
    <div
      style={{ backgroundColor: "var(--bs-primary)" }}
      className="d-flex align-items-center justify-content-center"
    >
      <div
        className="text-center text-white"
        style={{
          marginTop: "40px",
          paddingBottom: "8px",
          backgroundColor: "var(--bs-secondary)",
          borderRadius: "10px",
          width: "70vw",
        }}
      >
        <Tabs defaultActiveKey="players" className="mb-2 w-100 start-tabs" fill>
          <Tab eventKey="players" title="Players">
            <div>
              <span
                style={{
                  fontWeight: "bold",
                  borderRadius: "6px",
                  padding: "5px 10px 5px 10px",
                  marginBottom: "10px",
                  backgroundColor: "var(--bs-primary-hover)",
                }}
              >
                {lobbyCode}
              </span>
              {players.map((player, index) => {
                return (
                  <div
                    key={`lobby_player_${index}`}
                    style={{
                      fontWeight: "600",
                      marginTop: "5px",
                      display: "flex",
                      padding: "10px 10px 10px 10px",
                      marginLeft: "1%",
                      marginRight: "1%",
                      borderRadius: "10px",
                      backgroundColor: "var(--bs-primary-hover)",
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
                    {isCreator && (
                      <Button
                        variant="danger"
                        style={{ margin: "auto 0 auto auto" }}
                      >
                        Kick
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            <Button onClick={startGameHandler} className="m-2">
              Start Game
            </Button>
          </Tab>
          <Tab eventKey="rules" title="Rules"></Tab>
          <Tab eventKey="decks" title="Decks"></Tab>
        </Tabs>
      </div>
    </div>
  );
};
