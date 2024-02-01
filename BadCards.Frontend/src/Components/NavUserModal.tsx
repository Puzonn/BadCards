import axios from "axios";
import { Button, Nav } from "react-bootstrap";
import { Config } from "../Config";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

export const NavUserModal = ({
  show,
  handleLogout,
}: {
  show: boolean;
  handleLogout: () => {};
}) => {
  const auth = useContext(AuthContext);

  return (
    <div
      style={{
        fontWeight: "600",
        zIndex: "100",
        display: `${show ? "unset" : "none"}`,
        borderBottomLeftRadius: "10px",
        width: "220px",
        right: 0,
        backgroundColor: "var(--bs-secondary)",
      }}
      className="position-fixed"
    >
      <div
        className="m-3 d-flex text-white"
        style={{
          backgroundColor: "var(--bs-primary-hover)",
          padding: "5px 5px 5px 5px",
          borderRadius: "10px",
        }}
      >
        <img
          className=" rounded-circle "
          style={{ width: "35px" }}
          src={`https://cdn.discordapp.com/avatars/${auth.User?.DiscordId}/${auth.User?.AvatarId}.webp?size=64`}
        ></img>
        <span
          className="fs-5"
          style={{ margin: "0 0 0 5px", color: `#${auth.User?.ProfileColor}` }}
        >
          {auth.User?.Username}
        </span>
      </div>
      <hr className=" m-0 p-0 opacity-50 border-white"></hr>
      <Nav defaultActiveKey="/home" className="fs-6 text-center flex-column">
        <Nav.Link href="/options" eventKey="link-1">
          <span className="text-white">Options</span>
        </Nav.Link>
        <Nav.Link eventKey="link-2" className="text-center">
          {auth.IsLoggedIn && (
            <>
              <Button onClick={handleLogout} variant="danger">
                Logout
              </Button>
            </>
          )}
        </Nav.Link>
      </Nav>
    </div>
  );
};
