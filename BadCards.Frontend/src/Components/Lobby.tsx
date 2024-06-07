import { Button, Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { Player } from "../Types/Card";
import { PlayersTab } from "./LobbyTabs/PlayersTab";
import { useEffect } from "react";

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
  const isMobile = window.innerWidth <= 768;

  return (
    <Container>
      <Row>
        <div className="d-flex align-items-center justify-content-center">
          <div
            className="text-center text-white"
            style={{
              fontWeight: "600",
              marginTop: "40px",
              paddingBottom: "8px",
              minWidth: "70%",
            }}
          >
            <Tabs defaultActiveKey="players" className="mb-2 w-100" fill>
              <Tab
                eventKey="players"
                title={
                  <div>
                    <span>Players</span>
                  </div>
                }
              >
                <div className="tab-box">
                  <PlayersTab
                    lobbyCode={lobbyCode}
                    players={players}
                    isCreator={isCreator}
                  ></PlayersTab>
                  {isCreator && (
                    <>
                      <Button
                        onClick={startGameHandler}
                        variant="light"
                        style={{
                          fontWeight: 600,
                          opacity: players.length < 2 ? "0.7" : "1",
                        }}
                        className="m-2 text-black"
                      >
                        {players.length < 2 && (
                          <> You need atleast 2 players to start</>
                        )}
                        {players.length >= 2 && <> Start Game </>}
                      </Button>
                    </>
                  )}
                </div>
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
      </Row>
    </Container>
  );
};
