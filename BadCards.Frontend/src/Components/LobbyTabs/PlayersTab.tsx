import { DropdownButton } from "react-bootstrap";
import { Player } from "../../Types/Card";
import { useContext, useState } from "react";
import { ConnectionContext } from "../../Context/ConnectionContext";
import RobotIcon from "../../Assets/Icons/robot_icon.png";
import "../Styles/Start.css";
import { PlayerTabModal } from "./PlayerTabModal";

export const PlayersTab = ({
  lobbyCode,
  players,
  isCreator,
}: {
  lobbyCode: string;
  players: Player[];
  isCreator: boolean;
}) => {
  const { Connection } = useContext(ConnectionContext);
  const [showModal, setShowModal] = useState(false);
  const [clickedPlayer, setClickedPlayer] = useState<Player | undefined>(
    undefined
  );

  const AddBot = () => {
    if (typeof Connection === "undefined") {
      return;
    }
    
    Connection.send("AddBot");
  };

  const ShowModal = (player: Player) => {
    setClickedPlayer(player);
    setShowModal(true);
  };

  return (
    <>
      <span
        style={{
          fontWeight: "600",
          marginTop: "40px",
          paddingBottom: "8px",
        }}
      >
        {lobbyCode}
      </span>
      <hr></hr>
      {players.map((player, index) => {
        return (
          <div
            onClick={() => {
              ShowModal(player);
            }}
            key={`lobby_player_${index}`}
          >
            <div
              style={{
                fontWeight: "600",
                marginTop: "5px",
                display: "flex",
                padding: "10px 10px 10px 10px",
                borderRadius: "10px",
              }}
              className="player_hover"
            >
              <div className="text-start">
                {!player.IsBot && (
                  <>
                    <img
                      className="rounded-circle"
                      style={{ width: "45px" }}
                      src={`https://cdn.discordapp.com/avatars/${player.DiscordUserId}/${player.DiscordAvatarId}.webp?size=64`}
                    ></img>
                    <span className="fs-4 m-2">{player.Username}</span>
                  </>
                )}
                {player.IsBot && (
                  <>
                    <img
                      className="rounded-circle"
                      style={{ width: "45px" }}
                      src={RobotIcon}
                    ></img>
                    <span className="fs-4 m-2">{player.Username}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <PlayerTabModal
        State={showModal}
        CloseModal={() => setShowModal(false)}
        Player={clickedPlayer}
      />

      <div style={{ textAlign: "left" }}>
        <img
          onClick={AddBot}
          title="Add an AI Player"
          className="add-bot_button"
          src={RobotIcon}
        ></img>
      </div>
      {players.length >= 2 && !isCreator && (
        <h4 className="m-3"> Waiting for creator. </h4>
      )}
    </>
  );
};
