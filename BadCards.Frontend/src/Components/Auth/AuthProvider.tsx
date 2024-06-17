import { AuthContext } from "../../Context/AuthContext";
import { ReactNode, useState, useEffect } from "react";
import { User } from "../../Types/User";
import { AuthStatus } from "../../Types/Auth";
import axios from "axios";
import { Config } from "../../Config";

export const AuthProvider = ({ children }: IProps) => {
  const [status, setAuthStatus] = useState<AuthStatus>({
    User: undefined,
    IsFetched: false,
    IsLoggedIn: false,
  });

  useEffect(() => {
    axios.defaults.withCredentials = true;
    (async function () {
      FetchUser();
    })();
  }, []);

  const FetchUser = async () => {
    await axios
      .get(`${Config.default.ApiUrl}/auth/@me`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data)
        SetAuth(response.data);
      })
      .catch((er) => {
        SetAuth(undefined);
        const path = window.location.pathname;
        if (
          path === "/auth/discord" ||
          path === "/auth/discord/" ||
          path === "/legal" ||
          path === "/start" || path === "/lobby"
        ) {
          return;
        }
        window.location.href = "/start";
      });
  };

  const SetAuth = (userContext: User | undefined) => {
    if (typeof userContext === "undefined") {
      setAuthStatus({ User: userContext, IsFetched: true, IsLoggedIn: false });
    } else {
      setAuthStatus({ User: userContext, IsFetched: true, IsLoggedIn: true });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        User: status?.User,
        SetAuth: () => SetAuth,
        UpdateUser: FetchUser,
        IsFetched: status.IsFetched,
        IsLoggedIn: status.IsLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export interface IProps {
  children: ReactNode;
}
