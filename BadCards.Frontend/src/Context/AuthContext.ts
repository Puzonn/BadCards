import { createContext } from "react";
import { User } from "../Types/User";

export const AuthContext = createContext<AuthContextModel>({IsLoggedIn: false, setAuth: () => {}, IsFetched: false, User: undefined});

type AuthContextModel =
{
    IsLoggedIn: boolean;
    IsFetched: boolean;
    setAuth: (state: User | undefined) => void;
    User: User | undefined;
}
