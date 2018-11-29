export type RSSResponse = {
  query: Query;
  created: Date;
  count: number;
  lang: string;
};

type Query = {
  results: Results | null;
};

type Results = {
  item: Item[];
};

type Item = {
  title: string;
  link: string;
  pubDate: string;
};
