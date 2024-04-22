import "./Styles/NavBar.css";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import { Config } from "../Config";
import GithubLogo from "../Assets/Icons/github-mark-white.png";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";

export const NavBar = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState("");
  const auth = useContext(AuthContext);

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

  return (
    <>
      <Navbar expand="lg" style={{ backgroundColor: "var(--bs-default)" }}>
        <Container style={{ height: "35px" }} className="m-lg-0">
          <Navbar.Brand className="text-white" href="/home">
            Cards Against Humanity
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav style={{ height: "40px", fontWeight: "500" }}>
              <Nav.Link className="text-white" href="/home">
                HOME
              </Nav.Link>
              <Nav.Link className="text-white" href="/legal">
                LEGAL
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
                GITHUB
              </Nav.Link>
            </Nav>
            <div
              style={{ left: "93%" }}
              className="position-absolute top-0 end-0 p-1"
            > 
              {false && auth.IsLoggedIn && (
                <>
                  <div className="d-flex navbar-user-profile">
                    <img
                      onClick={() => {
                        window.location.href = "/options";
                      }}
                      src={`https://cdn.discordapp.com/avatars/${auth.User?.discordId}/${auth.User?.avatarId}.webp?size=64`}
                      alt="User Avatar"
                      style={{
                        padding: "4px",
                        width: "45px",
                        height: "45px",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <hr className=" m-0 p-0 opacity-50 border-white"></hr>
    </>
  );
};
