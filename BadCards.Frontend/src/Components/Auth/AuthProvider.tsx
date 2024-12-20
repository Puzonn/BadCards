import { AuthContext } from "../../Context/AuthContext";
import { ReactNode, useState, useEffect } from "react";
import { User } from "../../Types/User";
import { AuthStatus } from "../../Types/Auth";
import Api from "../../Api";

export const AuthProvider = ({ children }: IProps) => {
  const [status, setAuthStatus] = useState<AuthStatus>({
    User: undefined,
    IsFetched: false,
    IsLoggedIn: false,
  });

  useEffect(() => {
    (async function () {
      FetchUser();
    })();
  }, []);

  const FetchUser = async () => {
    await Api.get("auth/@me")
      .then((response: any) => {
        SetAuth(response.data);
      })
      .catch(async (er) => {
        SetAuth(undefined);
        
        //Login as guest when no user is logged in
        await Api.post("auth/guest").then(() => {
          window.location.reload()
        })

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
