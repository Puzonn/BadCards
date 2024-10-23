import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { Config } from "../../Config";
import NavGif from "../../Assets/Icons/nav_gif.gif";
import "../../../node_modules/flag-icons/css/flag-icons.min.css";
import { NavLanguageSelector } from "./NavLangaugeSelector";

export const NavBar = () => {
  const auth = useContext(AuthContext);
  const [showContext, setShowContext] = useState<boolean>(false);

  const HandleDiscordLogin = () => {
    window.location.href = Config.default.OAuth2;
  };

  return (
    <nav>
      <div className="max-w-screen bg-background shadow-sm shadow-black flex flex-wrap ml-5 md:justify-start justify-between relative">
        <a href="https://puzonnsthings.pl/" className="hover:scale-110">
          <img src={NavGif} />
        </a>
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
            <div className="flex items-center">
              <div className="max-sm:hidden">
                <NavLanguageSelector />
              </div>
              {auth.User?.role === "User" && (
                <button
                  type="button"
                  className="flex text-sm rounded-full"
                  id="user-menu-button"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-10 h-10 rounded-full"
                    src={auth.User?.avatarUrl}
                    alt="user photo"
                  />
                </button>
              )}
              {auth.User?.role === "Guest" && (
                <button
                  onClick={HandleDiscordLogin}
                  style={{ backgroundColor: "#6a86da" }}
                  className="border-0 hover:scale-105 mr-0 text-white text-sm p-2 rounded font-medium"
                >
                  Sign in with Discord
                </button>
              )}
            </div>
          )}

          <div
            className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700"
            id="language-dropdown-menu"
          >
            <ul className="py-2" aria-labelledby="user-menu-button"></ul>
          </div>
          <button
            onClick={() => setShowContext(!showContext)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
                href="https://github.com/Puzonn/BadCards"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Github
              </a>
            </li>
            <li>
              <a
                href="creator"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Creator
              </a>
            </li>

            <li>
              <a
                href="contact"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
      {showContext && (
        <div className="text-white flex flex-col bg-background">
          <ul className="flex flex-col font-medium ml-6 mt-1 md:p-0 rounded-lg rtl:space-x-reverse md:flex-row md:mt-0">
            <li className="flex">
              <a
                href="https://github.com/Puzonn/BadCards"
                className="block py-2  text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Github
              </a>
            </li>
            <li>
              <a
                href="creator"
                className="block py-2 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Creator
              </a>
            </li>

            <li>
              <a
                href="contact"
                className="block py-2 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Contact
              </a>
            </li>
            <li>
              <NavLanguageSelector />
            </li>
          </ul>
        </div>
      )}
      <hr className="max-w-screen h-1 border-white"></hr>
    </nav>
  );
};
