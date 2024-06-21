export type Card = {
  IsBlack: boolean;
  Content: string;
  CardId: number;
  OwnerId: string;
  OwnerUsername: string;
};

export interface IWhiteCard extends Card {
  IsSelected: boolean;
  IsJudge: boolean;
  HasSelectedRequired: boolean;
}

export type OnJudgeSelectCardEvent = {
  SelectedCardId: number;
  TotalVotes: number;
  SufficientVotes: number;
};

export type FormattedBlackCardContent = {
  FormattedContent: string;
  Class: string;
};
