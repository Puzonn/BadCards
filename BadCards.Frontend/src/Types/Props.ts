import { Player } from "./Player";

export interface ILobby {
    Players: Player[]
    LobbyCode: string;
    IsCreator: boolean;
    StartGameHandler: () => void;
    KickHandler: (userId: number) => void;
    AddBotHandler: () => void;
}

export interface ILeaderboard {
  Players: Player[];
  IsLeaderboardOpen: boolean;
  JudgeUsername: string;  
  OnToggleLeaderboard: () => void;
}

export interface IContextMenu {
    OnLeaveGame: () => void;
    OnEndGame: () => void;
}
