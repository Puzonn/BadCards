import { AuthContext } from "../../Context/AuthContext";
import { ReactNode, useState, useEffect, useContext } from "react";
import { User } from "../../Types/User";
import { AuthStatus } from "../../Types/Auth";
import axios from "axios";

export const AuthProvider = ({ children }: IProps) => {
  const [status, setAuthStatus] = useState<AuthStatus>({
    User: undefined,
    IsFetched: false,
    IsLoggedIn: false,
  });

  useEffect(() => {
    axios.defaults.withCredentials = true;

    (async function () {
      await axios
        .get(`${process.env.REACT_APP_API_URL}/auth/@me`, {
          withCredentials: true,
        })
        .then((response) => {
          SetAuth(response.data as User);
        })
        .catch((er) => {
          SetAuth(undefined);
          if (window.location.pathname !== "/login") {
            //window.location.href = "/login";
          }
        });
    })();
  }, []);

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
        setAuth: () => SetAuth,
        IsFetched: status.IsFetched,
        IsLoggedIn: status.IsLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

interface IProps {
  children: ReactNode;
}
