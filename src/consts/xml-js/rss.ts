export type RSS = {
  'rdf:RDF'?: RSS1;
  rss?: RSS2;
};

type RSS1 = {
  item: RSS1Item[];
};

type RSS1Item = {
  title: Text;
  link: Text;
  'dc:date': Text;
};

type RSS2 = {
  channel: Channel;
};

type Channel = {
  title: Text;
  item: RSS2Item[];
};

type RSS2Item = {
  title: Text;
  link: Text;
  pubDate: Text;
};

type Text = {
  _text: string;
};
