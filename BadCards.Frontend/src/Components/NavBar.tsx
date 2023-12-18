import "./Styles/NavBar.css";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";

export const NavBar = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState("");
  const auth = useContext(AuthContext);

  const ChangeLanguage = async (e: any) => {
    const selectedLang = e.target.value;

    await fetch("https://localhost:7083/user/set-language", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(selectedLang),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          setLang(selectedLang);
          i18n.changeLanguage(selectedLang);
        } else {
          console.log("Error while changing language:", response);
        }
      })
      .catch((error) => {
        console.error("Error while changing language:", error);
      });
  };

  const Revoke = async () => {
    await axios
      .post(`${process.env.REACT_APP_API_URL}/auth/revoke`)
      .then((x) => {
        window.location.href = "/";
      });
  };

  useEffect(() => {
    const lang = Cookies.get("LanguagePreference");
    if (lang) {
      setLang(lang);
      i18n.changeLanguage(lang);
    }
  }, []);

  return (
    <nav>
      <div className="nav-container">
        <h2>Cards Agains Humanity</h2>
        {auth.IsFetched && auth.IsLoggedIn && (
          <>
            <a href="/dashboard">Home</a>
            <a href="/options">Options</a>
          </>
        )}
        {auth.IsFetched && !auth.IsLoggedIn && <a href="/login">Login</a>}
        <a href="/legal">Legal</a>
        {auth.IsFetched && auth.IsLoggedIn && (
          <div className="nav-user">
            <div>
              <span>{auth.User?.Username}</span>
              <p onClick={Revoke} className="nav-logout">
                Logout
              </p>
            </div>
            <img
              alt="user_discord_avatar"
              src={`https://cdn.discordapp.com/avatars/${auth.User?.DiscordId}/${auth.User?.AvatarId}.webp?size=64`}
            ></img>
          </div>
        )}
      </div>
    </nav>
  );
};
