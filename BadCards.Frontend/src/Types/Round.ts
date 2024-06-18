import { Card, IWhiteCard } from "./Card";
import { Player } from "./Player";

export type Round = {
  HasSelectedRequired: boolean;
  LobbyCode: string;
  AnswerCount: number;
  Players: Player[];
  GameStarted: boolean;
  IsCreator: boolean;
  IsJudge: boolean;
  IsWaitingForJudge: boolean;
  IsWaitingForNextRound: boolean;
  HasSelected: boolean;
  JudgeUsername: string;
  WhiteCards: IWhiteCard[];
  BlackCard: Card;
  PlayerSelectedCards: Card[];
  LobbySelectedCards: Card[];
  SelectedWinnerId: number;
  StateNextRound: () => void;
  StateSelectCards: (cards: Card[]) => void;
  StateStartGame: () => void;
  StateJudgeSelectCard: (ownerId: number) => void;
  StateLeaveGame: () => void;
  StateEndGame: () => void;
  StateKickPlayer: (userId: number) => void;
  OnSelectCard: (card: Card | Card[]) => void;
};
