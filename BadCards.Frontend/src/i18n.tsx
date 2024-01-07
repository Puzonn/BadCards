import i18n, { changeLanguage } from "i18next";
import { initReactI18next } from "react-i18next";
import pl from "./Translations/PL/common.json";
import en from "./Translations/EN/common.json";

const resources = {
  pl: {
    translation: pl,
  },
  en: {
    translation: en,
  },
};

const cachedLang = localStorage.getItem("lang");

i18n.use(initReactI18next).init({
  resources,
  lng: cachedLang ? cachedLang : "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
