export type OptionResult = {
  id: string;
  text: string;
  order: number;
  votes: number;
};

export type PollResults = {
  id: string;
  question: string;
  createdAt: string;
  totalVotes: number;
  options: OptionResult[];
};
