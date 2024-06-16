import { Player } from "./Card";

export type Room = {
  LobbyName: string;
  Players: number;
  RoomId: number;
  LobbyCode: string;
};

export interface ILeaderboard {
  Players: Player[];
  IsLeaderboardOpen: boolean;
  JudgeUsername: string;  
  OnToggleLeaderboard: () => void;
}
