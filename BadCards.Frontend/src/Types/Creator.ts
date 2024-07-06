export interface Options {
  DefaultPrompt: string;
  Temperature: number;
  MaxGenerations: number;
  GenerateQuestion: boolean;
  GenerateAnswers: boolean;
  BatchCount: number;
  EnableBatch: boolean;
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
}

export const DefaultOptions: Options = {
  BatchCount: 1,
  EnableBatch: false,
  DefaultPrompt: "",
  GenerateQuestion: true,
  GenerateAnswers: true,
  AnswerCount: 5,
  MaxGenerations: 1,
  Temperature: 0.7,
};
