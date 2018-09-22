export type BlogEntity = {
  title: string,
  url: string,
  feedUrl: string
};

export type ItemEntity = {
  title: string,
  url: string,
  published: Date
};

export type CountEntity = {
  url: string,
  count: string,
  type: string
};