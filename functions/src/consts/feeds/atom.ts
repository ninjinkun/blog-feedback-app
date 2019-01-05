export type Atom = {
  feed: Feed;
};

type Feed = {
  title: Text;
  link: Link | Link[];
  entry: Entry[];
};

type Entry = {
  id: Text;
  link: Link | Link[];
  title: Text | FeedBurnerTitle;
  updated: Text;
  published?: Text;
  'feedburner:origLink'?: Text;
};

export type Link = {
  _attributes: {
    href: string;
    rel?: string;
  };
};

type Text = {
  _text: string;
};

type FeedBurnerTitle = {
  _cdata: string;
};
