import { Player } from "./Card";

export interface ILobby {
    Players: Player[]
    LobbyCode: string;
    IsCreator: boolean;
    StartGameHandler: () => void;
    KickHandler: (userId: number) => void;
}