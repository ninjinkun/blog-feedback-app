export interface RSS1 {
  'rdf:RDF': RSS;
}

interface RSS {
  item: Item[];
  channel: Channel;
}

interface Channel {
  title: Text;
  link: Text;
}

interface Item {
  title: Text;
  link: Text;
  'dc:date': Text;
}

interface Text {
  _text: string;
}
