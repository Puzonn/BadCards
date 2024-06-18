import { useState } from "react";
import MenuIcon from "../Assets/Icons/menu_icon.svg";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { IContextMenu } from "../Types/Props";

export const GameMenuContext = (context: IContextMenu) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  function classNames(
    ...classes: (string | boolean | undefined | null)[]
  ): string {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton
          className="inline-flex hover:scale-105 justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold
         text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <img className="w-6 h-6" src={MenuIcon} />
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
          className="absolute right-0 z-10 border-2 border-black shadow-white 
         mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-white ring-opacity-5 focus:outline-none"
        >
          <div className="py-1">
            <MenuItem>
              {({ focus }) => (
                <a
                  href="#"
                  className={classNames(
                    focus ? "bg-gray-100 text-gray-700" : "text-black",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  Settings
                </a>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <a
                  href="#"
                  className={classNames(
                    focus ? "bg-gray-100 text-red-900" : "text-red-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  Leave
                </a>
              )}
            </MenuItem>
            <form method="POST" action="#">
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={context.OnEndGame}
                    className={classNames(
                      focus ? "bg-gray-100 text-red-900" : "text-red-700",
                      "block w-full px-4 py-2 text-left text-sm"
                    )}
                  >
                    End Game
                  </button>
                )}
              </MenuItem>
            </form>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
};
