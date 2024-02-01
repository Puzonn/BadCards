import "./Styles/NavBar.css";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import { Config } from "../Config";
import GithubLogo from "../Assets/Icons/github-mark-white.png";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { NavUserModal } from "./NavUserModal";
export const NavBar = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState("");
  const auth = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  const Logout = async () => {
    await axios
      .post(`${Config.default.ApiUrl}/auth/revoke`)
      .then((response) => {
        window.location.href = "/";
      })
      .catch(() => {});
  };

  useEffect(() => {
    const lang = Cookies.get("LanguagePreference");
    if (lang) {
      setLang(lang);
      i18n.changeLanguage(lang);
    }
  }, []);

  const FormatUsername = () => {
    const username = auth.User?.Username;
    if (!username) {
      return "";
    }

    return username.substring(0, 12);
  };

  return (
    <>
      <Navbar
        expand="lg"
        style={{ backgroundColor: "var(--bs-secondary)" }}
        variant="dark"
      >
        <Container style={{ height: "35px" }} className="m-lg-0">
          <Navbar.Brand href="/home">Cards Against Humanity</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav style={{ height: "40px" }}>
              <Nav.Link className="text-white" href="/home">
                Home
              </Nav.Link>
              <Nav.Link className="text-white" href="/legal">
                Legal
              </Nav.Link>

              <Nav.Link
                className="text-white"
                href="https://github.com/Puzonn/BadCards"
              >
                <img
                  style={{
                    width: "25px",
                    marginRight: "3px",
                    padding: "0 2px 6px 2px",
                  }}
                  src={GithubLogo}
                ></img>
                Github
              </Nav.Link>
            </Nav>
            <div
              style={{ left: "97%" }}
              className="position-absolute top-0 end-0 p-1"
            >
              {auth.IsLoggedIn && (
                <>
                  <div
                    onClick={() => setShowModal(!showModal)}
                    className="d-flex navbar-user-profile"
                  >
                    <img
                      className="rounded-circle"
                      src={`https://cdn.discordapp.com/avatars/${auth.User?.DiscordId}/${auth.User?.AvatarId}.webp?size=64`}
                      alt="User Avatar"
                      style={{
                        width: "45px",
                        height: "45px",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                  <div
                    onClick={() => setShowModal(!showModal)}
                    className="navbar-user-profile"
                    style={{
                      width: "25px",
                      height: "25px",
                      left: "20px",
                      bottom: "22px",
                      borderTopLeftRadius: "10px",
                      textAlign: "center",
                      paddingTop: "9px",
                      paddingLeft: "5px",
                      position: "relative",
                      backgroundColor: "var(--bs-secondary)",
                    }}
                  >
                    <div
                      className="triangle"
                      style={{
                        height: "15px",
                        cursor: "pointer",
                      }}
                    >
                      <div className="over-triangle"></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <hr className=" m-0 p-0 opacity-50 border-white"></hr>
      <NavUserModal handleLogout={Logout} show={showModal}></NavUserModal>
    </>
  );
};
