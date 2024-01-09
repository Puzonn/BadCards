import { useContext, useEffect, useState } from "react";
import { Config } from "../../Config";
import axios from "axios";
import "../Styles/Options.css";
import { AuthContext } from "../../Context/AuthContext";
import { t } from "i18next";
import i18n from "../../i18n";
import Cookies from "js-cookie";

export const OptionsLanguageChange = () => {
  const [locale, setLocale] = useState("");

  useEffect(() => {
    const locale = Cookies.get("LanguagePreference");
    if (locale) {
      setLocale(locale);
    }
  }, []);

  const ChangeLanguage = (newLocale: string) => {
    console.warn(`Changing i18n to ${newLocale}`);
    axios
      .patch(`${Config.default.ApiUrl}/user/set-language`, newLocale, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          i18n.changeLanguage(newLocale);
          window.location.reload();
        }
      });
  };

  return (
    <>
      <h2>{t("options.change-language")}</h2>
      <ul className="options.change-language_list">
        <li
          onClick={(e) => {
            ChangeLanguage("en");
          }}
        >
          <span>English {locale === "en" ? "- Current" : ""}</span>
        </li>
        <li
          onClick={(e) => {
            ChangeLanguage("pl");
          }}
        >
          <span>Polish {locale === "pl" ? "- Current" : ""}</span>
        </li>
      </ul>
    </>
  );
};
