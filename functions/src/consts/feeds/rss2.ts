export type RSS2 = {
  rss: RSS;
};

type RSS = {
  channel: Channel;
};

type Channel = {
  title: Text;
  link: Text;
  item: Item[];
};

type Item = {
  title: Text;
  link: Text;
  pubDate: Text;
};

type Text = {
  _text: string;
  _cdata?: string;
};
