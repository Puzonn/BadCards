import { createContext } from "react";
import { User } from "../Types/User";

export const AuthContext = createContext<AuthContextModel>({
  IsLoggedIn: false,
  SetAuth: () => {},
  UpdateUser: () => {},
  IsFetched: false,
  User: undefined,
});

type AuthContextModel = {
  IsLoggedIn: boolean;
  IsFetched: boolean;
  SetAuth: (state: User | undefined) => void;
  UpdateUser: () => void;
  User: User | undefined;
};
