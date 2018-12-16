export type Atom = {
  feed: Feed;
  title: Text;
  link: Link;
};

type Feed = {
  title: Text;
  entry: Entry[];
};

type Entry = {
  id: Text;
  link: Link | Link[];
  title: Text;
  updated: Text;
  published?: Text;
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
