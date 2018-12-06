export type Atom = {
  feed: Feed;
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
