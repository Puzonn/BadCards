import { FormEvent, useContext, useEffect, useState } from "react";
import PlayIcon from "../../Assets/Icons/play_icon.png";

export const CreateTab = ({
  onSubmit,
  allowCreate,
}: {
  onSubmit: (password: string) => {};
  allowCreate: boolean;
}) => {
  const [password, setPassword] = useState<string>("");
  const [passwordInputFocused, setPasswordInputFocused] =
    useState<boolean>(false);

  const preSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(password);
  };

  const OnPasswordInputFocus = (state: boolean) => {
    if (password !== "" && state === false) {
      return;
    }
    setPasswordInputFocused(state);
  };

  if (!allowCreate) {
    return (
      <div className="tab-box text-xl-center">
        <span>You have to be atleast Discord User to create lobby </span>
      </div>
    );
  }

  return (
    <form onSubmit={preSubmit} className="relative w-full text-black">
      <div className="relative w-full bg-transparent h-20 border-2 border-black rounded bg-white">
        <p
          className={`flex inset-0 transition-all pointer-events-none font-normal bg-transparent absolute  ${
            !passwordInputFocused
              ? "flex justify-start pl-4 items-center text-3xl normal-text"
              : "pl-3 focused-text justify-start "
          }`}
        >
          Password (not requried)
        </p>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => {
            OnPasswordInputFocus(true);
          }}
          onBlur={() => {
            OnPasswordInputFocus(false);
          }}
          className={`inset-0 w-full placeholder:text-black outline-none bg-transparent text-3xl pl-3 h-full ${
            !passwordInputFocused ? "opacity-0" : ""
          }`}
        />
      </div>
      <button
        type="submit"
        className={`flex flex-row-reverse bg-blue-600 shadow-md shadow-black items-center gap-2 rounded-lg mt-4 p-2 px-10 text-center align-middle text-1xl hover:scale-105 
        font-bold text-white transition-all`}
        value="Create Lobby"
      >
        Create Lobby
        <img className="w-4" src={PlayIcon}></img>
      </button>
    </form>
  );
};
