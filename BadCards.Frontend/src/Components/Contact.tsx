import { useState } from "react";
import { useSSR } from "react-i18next";

export const Contact = () => {
  const [emailInputFocused, setEmailInputFocused] = useState<boolean>(false);
  return (
    <div className="w-full flex mt-4 justify-center">
      <div className="md:w-1/2">
        <form className="relative w-full p-3 justify-center bg-white rounded text-black">
          <div className="relative w-full bg-transparent h-20 border-2 border-black">
            <p
              className={`flex inset-0 transition-all pointer-events-none font-normal bg-transparent absolute  ${
                !emailInputFocused
                  ? "flex justify-start pl-4 items-center text-3xl normal-text"
                  : "pl-3 focused-text justify-start "
              }`}
            >
              Password (not requried)
            </p>
            <input
              type="email"
              onFocus={() => {
                setEmailInputFocused(true);
              }}
              onBlur={() => {
                setEmailInputFocused(false);
              }}
              className={`inset-0 w-full placeholder:text-black outline-none bg-transparent pt-3 text-3xl pl-3 h-full ${
                !emailInputFocused ? "opacity-0" : ""
              }`}
            />
          </div>
          <input
            type="submit"
            className={`rounded-lg mt-4 py-4 px-10 text-center align-middle text-1xl hover:scale-105 
        font-bold text-white shadow-md transition-all bg-black`}
            value="Create Lobby"
          />
        </form>
      </div>
    </div>
  );
};
