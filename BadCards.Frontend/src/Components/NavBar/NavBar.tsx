import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { Config } from "../../Config";
import NavGif from "../../Assets/Icons/nav_gif.gif";
import "../../../node_modules/flag-icons/css/flag-icons.min.css";
import { NavLanguageSelector } from "./NavLangaugeSelector";

export const NavBar = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState("");
  const auth = useContext(AuthContext);
  const [showContext, setShowContext] = useState<boolean>(false);

  const Logout = async () => {
    await axios
      .post(`${Config.default.ApiUrl}/auth/revoke`)
      .then((response) => {
        window.location.href = "/";
      })
      .catch(() => {});
  };

  return (
    <nav>
      <div className="max-w-screen bg-black shadow-sm shadow-black flex flex-wrap ml-5 md:justify-start justify-between relative">
        <img src={NavGif} />
        <a
          href="https://puzonnsthings.pl/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center hover:opacity-45 text-2xl font-semibold whitespace-nowrap dark:text-white">
            BadCards
          </span>
        </a>
        <div className="flex items-center md:order-2 ml-auto space-x-3 pr-5 md:space-x-0 rtl:space-x-reverse">
          {auth.IsFetched && auth.IsLoggedIn && (
            <div className="flex">
              <NavLanguageSelector />
              <button
                type="button"
                className="flex text-sm rounded-full md:me-0"
                id="user-menu-button"
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="w-10 h-10 rounded-full"
                  src={`https://cdn.discordapp.com/avatars/${auth.User?.discordId}/${auth.User?.avatarId}.webp?size=100`}
                  alt="user photo"
                />
              </button>
            </div>
          )}

          <div
            className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700"
            id="language-dropdown-menu"
          >
            <div className="px-4 py-3">
              <span className="block text-sm text-gray-900 dark:text-white">
                Bonnie Green
              </span>
              <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                name@flowbite.com
              </span>
            </div>
            <ul className="py-2" aria-labelledby="user-menu-button">
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Settings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Earnings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Sign out
                </a>
              </li>
            </ul>
          </div>
          <button
            data-collapse-toggle="navbar-user"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-user"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path stroke="currentColor" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>
        <div
          className="items-center justify-start hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-user"
        >
          <ul className="flex flex-col font-medium p-2 ml-6 mt-1 md:p-0 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0">
            <li className="flex">
              <a
                href="#"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Github
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Services
              </a>
            </li>

            <li>
              <a
                href="#"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
      <hr className="max-w-screen h-1 border-white"></hr>
    </nav>
  );
};
