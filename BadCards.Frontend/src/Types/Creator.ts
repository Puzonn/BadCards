export interface Options {
  DefaultPrompt: string;
  Temperature: number;
  MaxGenerations: number;
  GenerateQuestion: boolean;
  GenerateAnswers: boolean;
  BatchCount: number;
  UseBatch: boolean;
  AnswerCount: number;
}

export interface Prompt {
  Question: string;
  Answers: string[];
  AnswerCount: number;
  TokensUsed: number;
}

export interface CreatorPromptOptions {
  AdditionalPromptNote?: string;
  GenerateAnswers: boolean;
  GenerateQuestion: boolean;
  UseBatch: boolean;
  BatchCount: number;
}

export const DefaultOptions: Options = {
  BatchCount: 1,
  UseBatch: false,
  DefaultPrompt: "",
  GenerateQuestion: true,
  GenerateAnswers: true,
  AnswerCount: 5,
  MaxGenerations: 1,
  Temperature: 0.7,
};
