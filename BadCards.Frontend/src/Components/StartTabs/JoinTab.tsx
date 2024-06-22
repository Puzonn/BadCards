import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";

export const JoinTab = ({
  onSubmit,
  error,
}: {
  onSubmit: (lobbyCode: string, password: string) => {};
  error: string;
}) => {
  const [password, setPassword] = useState<string>("");
  const [lobbyCode, setLobbyCode] = useState<string>("");
  const [passwordInputFocused, setPasswordInputFocused] =
    useState<boolean>(false);
  const [codeInputFocused, setCodeInputFocused] = useState<boolean>(false);

  const preSubmit = (event: FormEvent) => {
    event.preventDefault();

    onSubmit(lobbyCode, password);
  };

  const OnCodeInputFocus = (state: boolean) => {
    if (password !== "" && state === false) {
      return;
    }
    setCodeInputFocused(state);
  };

  const OnPasswordInputFocus = (state: boolean) => {
    if (password !== "" && state === false) {
      return;
    }
    setPasswordInputFocused(state);
  };

  return (
    <form onSubmit={preSubmit} className="relative w-full text-black">
      <div className="relative w-full bg-transparent h-20 border-2 border-black rounded bg-white">
        <p
          className={`flex inset-0 transition-all pointer-events-none font-normal bg-transparent absolute  ${
            !codeInputFocused
              ? "flex justify-start pl-4 items-center text-3xl normal-text"
              : "pl-3 focused-text justify-start "
          }`}
        >
          Lobby Code (required)
        </p>
        <input
          type="text"
          maxLength={10}
          onChange={(e) => setLobbyCode(e.target.value)}
          onFocus={() => {
            OnCodeInputFocus(true);
          }}
          onBlur={() => {
            OnCodeInputFocus(false);
          }}
          className={`inset-0 w-full placeholder:text-black outline-none bg-transparent pt-3 text-3xl pl-3 h-full ${
            !codeInputFocused ? "opacity-0" : ""
          }`}
        />
      </div>
      <div className="relative w-full bg-transparent mt-3 h-20 border-2 border-black rounded bg-white">
        <p
          className={`flex inset-0 transition-all pointer-events-none font-normal bg-transparent absolute  ${
            !passwordInputFocused
              ? "flex justify-start pl-4 items-center text-3xl normal-text"
              : "pl-3 focused-text justify-start "
          }`}
        >
          Password (not required)
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
          className={`inset-0 w-full placeholder:text-black outline-none bg-transparent pt-3 text-3xl pl-3 h-full ${
            !passwordInputFocused ? "opacity-0" : ""
          }`}
        />
      </div>

      <input
        type="submit"
        className={`rounded-lg mt-4 py-4 px-10 text-center align-middle text-1xl hover:scale-105 
        font-bold text-white shadow-md transition-all bg-black`}
        value="Join Lobby"
      />
    </form>
  );
};
