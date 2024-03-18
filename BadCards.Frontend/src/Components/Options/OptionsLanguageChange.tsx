import { useEffect, useState } from "react";
import { Config } from "../../Config";
import axios from "axios";
import "../Styles/Options.css";
import { t } from "i18next";
import i18n from "../../i18n";
import Cookies from "js-cookie";

interface ILanguage {
  LanguageName: string;
  LanguageIcon: string;
}

export const OptionsLanguageChange = () => {
  const [locale, setLocale] = useState("");
  const [languageFlags, setLanguageFlag] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const fetchImage = async () => {
      languages.map((lang) => {
        const img = require(`../../Assets/Flags/${lang.LanguageIcon}.png`);
        console.log('loading: ',lang.LanguageName);
        setLanguageFlag({ ...languages, [lang.LanguageIcon]: img });
      });
    };
    fetchImage();
  }, []);

  const languages: ILanguage[] = [
    { LanguageName: "Poland", LanguageIcon: "flag_poland" },
    { LanguageName: "America", LanguageIcon: "flag_america" },
  ];

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
        {languages.map((lang) => {
          console.log('rendering: ', languageFlags[lang.LanguageIcon])
          return (
            <li key={`option_lang_${lang.LanguageName}`}>
              <img style={{width: '30px'}} src={languageFlags[lang.LanguageIcon]}></img>
            </li>
          );
        })}
      </ul>
    </>
  );
};
