export type Card = {
  IsBlack: boolean;
  Content: string;
  CardId: number;
};

export interface IWhiteCardUI extends Card {
  IsSelected: boolean;
  IsJudge: boolean;
  HasSelectedRequired: boolean;
  StateCardClicked?: (cardId: number) => void;
}

export type Player = {
  Username: string;
  Points: number;
  DiscordAvatarId: string;
  DiscordUserId: string;
};

export interface ISelectedWhiteCard extends IWhiteCardUI {
  AnswerCount: number;
  AnswerSelectedIndex: number;
  IsSelectedByJudge?: boolean;
  SelectedBy: string;
  ShowContent: boolean;
  IsOwner: boolean;
  IsJudge: boolean;
  SelectedByUsername: string;
  ShowUsername: boolean;
  IsSelected: boolean;
  IsWaitingForNextRound: boolean;
  
  HandleAnswerIndexClick: (index: number) => void;
}

export type Round = {
  HasSelectedRequired: boolean;
  RoomCode: string;
  AnswerCount: number;
  Players: Player[];
  GameStarted: boolean;
  IsCreator: boolean;
  IsJudge: boolean;
  IsWaitingForJudge: boolean;
  IsWaitingForNextRound: boolean;
  JudgeUsername: string;
  WhiteCards: IWhiteCardUI[];
  BlackCard: Card;
  SelectedCards: ISelectedWhiteCard[] | undefined;

  StateNextRound: () => void;
  StateSelectCard: (cardId: number) => void;
  StateStartGame: () => void;
};

export type OnJudgeSelectCardEvent = {
  SelectedCardId: number;
  TotalVotes: number;
  SufficientVotes: number;
}

export type FormattedBlackCardContent = {
  FormattedContent: string;
  Class: string;
};
