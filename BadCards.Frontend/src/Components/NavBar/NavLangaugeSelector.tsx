import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";

export const NavLanguageSelector = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { User } = useContext(AuthContext);
  const [locale, setLocale] = useState<string>("us");

  useEffect(() => {
    const locale = localStorage.getItem("locale");
    if (locale) {
      setLocale(locale);
    } else {
      localStorage.setItem("locale", "us");
    }
  }, []);

  function classNames(
    ...classes: (string | boolean | undefined | null)[]
  ): string {
    return classes.filter(Boolean).join(" ");
  }

  const changeLocale = (locale: string) => {
    localStorage.setItem("locale", locale);
    window.location.reload();
  };

  return (
    <Menu as="div" className="relative pb-1 text-left mr-5 pt-1">
      <div>
        <MenuButton
          className="justify-center items-center hover:scale-105 gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold
         text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <span className={`fi fis fi-${locale} mr-2`}></span>
          <span>{locale.toUpperCase()}</span>
        </MenuButton>
      </div>

      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems
          className="absolute right-2 z-10 border-2 border-black shadow-white 
         origin-top-right rounded-md bg-white shadow-lg ring-1 top-12 ring-white ring-opacity-5 w-32 font-bold focus:outline-none"
        >
          <div className="py-1">
            <MenuItem>
              {({ focus }) => (
                <a
                  href="#"
                  onClick={() => changeLocale("us")}
                  className={classNames(
                    focus ? "bg-gray-100 text-gray-700" : "text-black",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  <span className="fi fis fi-us mr-2"></span>
                  US
                </a>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <a
                  onClick={() => changeLocale("pl")}
                  href="#"
                  className={classNames(
                    focus ? "bg-gray-100 text-gray-700" : "text-black",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  <span className="fi fis fi-pl mr-2"></span>
                  POLISH
                </a>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
};
