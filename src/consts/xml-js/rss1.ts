export type RSS1 = {
  'rdf:RDF': RSS;
};

type RSS = {
  item: Item[];
};

type Item = {
  title: Text;
  link: Text;
  'dc:date': Text;
};

type Text = {
  _text: string;
};
