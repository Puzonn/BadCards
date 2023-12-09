import { User } from "./User";

export interface AuthStatus {
    User: User | undefined;
    IsLoggedIn: boolean;
    IsFetched: boolean;
}