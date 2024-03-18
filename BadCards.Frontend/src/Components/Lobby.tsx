import { Button, Tab, Tabs } from "react-bootstrap";
import { Player } from "../Types/Card";
import { PlayersTab } from "./LobbyTabs/PlayersTab";

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
    <div className="d-flex align-items-center justify-content-center">
      <div
        className="text-center text-white"
        style={{
          fontWeight: "600",
          marginTop: "40px",
          paddingBottom: "8px",
          width: "70vw",
        }}
      >
        <Tabs defaultActiveKey="players" className="mb-2 w-100 start-tabs" fill>
          <Tab
            eventKey="players"
            title={
              <div>
                <span>Players</span>
              </div>
            }
          >
            <PlayersTab
              lobbyCode={lobbyCode}
              players={players}
              isCreator={isCreator}
              ></PlayersTab>
            {isCreator && (
              <Button
                onClick={startGameHandler}
                variant="light"
                style={{ fontWeight: 600 }}
                className="m-2 text-black"
              >
                {players.length < 2 && <> You need atleast 2 people to start</>}
                {players.length >= 2 && <> Start Game </>}
              </Button>
            )}
          </Tab>
          <Tab
            eventKey="rules"
            title={
              <div>
                <span>Rules</span>
              </div>
            }
          ></Tab>
          <Tab
            eventKey="decks"
            title={
              <div>
                <span>Decks</span>
              </div>
            }
          ></Tab>
        </Tabs>
      </div>
    </div>
  );
};
