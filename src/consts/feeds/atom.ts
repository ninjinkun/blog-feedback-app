export type Atom = {
  feed: Feed;
};

type Feed = {
  title: Text;
  link: Link;
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

type Link = {
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
