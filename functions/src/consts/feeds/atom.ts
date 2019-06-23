export interface Atom {
  feed: Feed;
}

interface Feed {
  title: Text;
  link: Link | Link[];
  entry: Entry[];
}

interface Entry {
  id: Text;
  link: Link | Link[];
  title: Text | FeedBurnerTitle;
  updated: Text;
  published?: Text;
  'feedburner:origLink'?: Text;
}

export interface Link {
  _attributes: {
    href: string;
    rel?: string;
  };
}

interface Text {
  _text: string;
}

interface FeedBurnerTitle {
  _cdata: string;
}
