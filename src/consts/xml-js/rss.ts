export type RSS = {
  rss: {
    channel: Channel;
  };
};

type Channel = {
  title: Text;
  item: Item[];
};

type Item = {
  title: Text;
  link: Text;
  pubDate: Text;
};

type Text = {
  _text: string;
};
