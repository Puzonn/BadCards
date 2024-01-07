import "./Styles/NavBar.css";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import { Config } from "../Config";

export const NavBar = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState("");
  const auth = useContext(AuthContext);

  const Revoke = async () => {
    await axios.post(`${Config.default.ApiUrl}/auth/revoke`).then((x) => {
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

  const FormatUsername = () => {
    const username = auth.User?.Username;
    if (!username) {
      return "";
    }

    return username.substring(0, 12);
  };

  return (
    <nav>
      <div className="nav-container">
        <a href="/start" className="nav-header">
          Cards Agains Humanity
        </a>
        {auth.IsFetched && auth.IsLoggedIn && (
          <>
            <a href="/options">Options</a>
          </>
        )}
        <a href="/legal">Legal</a>
        {auth.IsFetched && auth.IsLoggedIn && (
          <div className="nav-user">
            <div className="nav-user-info">
              <span
                className="nav-user-username"
                style={{ color: `#${auth.User?.AvatarColor}` }}
              >
                {FormatUsername()}
              </span>
              <p onClick={Revoke} className="nav-logout">
                Logout
              </p>
            </div>
            <img
              style={{ borderColor: `#${auth.User?.AvatarColor}` }}
              alt="user_discord_avatar"
              src={`https://cdn.discordapp.com/avatars/${auth.User?.DiscordId}/${auth.User?.AvatarId}.webp?size=64`}
            ></img>
          </div>
        )}
      </div>
    </nav>
  );
};
