export type Card = {
  IsBlack: boolean;
  Content: string;
  CardId: number;
  OwnerId: number;
  OwnerUsername: string;
};

export interface IWhiteCard extends Card {
  IsSelected: boolean;
  IsJudge: boolean;
  HasSelectedRequired: boolean;
}

export type Player = {
  IsBot: boolean;
  UserId: number;
  Username: string;
  Points: number;
  DiscordAvatarId: string;
  DiscordUserId: string;
  ProfileColor: string;
};

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

export type OnJudgeSelectCardEvent = {
  SelectedCardId: number;
  TotalVotes: number;
  SufficientVotes: number;
};

export type FormattedBlackCardContent = {
  FormattedContent: string;
  Class: string;
};
