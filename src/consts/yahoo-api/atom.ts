export type AtomResponse = {
  query: Query;
  created: Date;
  count: number;
  lang: string;
};

type Query = {
  results: Results | null;
};

type Results = {
  entry: Entry[];
};

type Entry = {
  title: string;
  link: Link | Link[];
  published?: string;
  updated: string;
};

type Link = {
  href: string;
};
