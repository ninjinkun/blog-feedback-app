export type HTMLStringResponse = {
  query: Query;
  created: string;
  count: number;
  lang: string;
};

type Query = {
  results: Results | null;
};

type Results = {
  result: string;
};
