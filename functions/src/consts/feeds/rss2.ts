export interface RSS2 {
  rss: RSS;
}

interface RSS {
  channel: Channel;
}

interface Channel {
  title: Text;
  link: Text;
  item: Item[];
}

interface Item {
  title: Text;
  link: Text;
  pubDate: Text;
}

interface Text {
  _text: string;
  _cdata?: string;
}
