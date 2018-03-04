export class BlogEntity {
  constructor({ title, url, feedUrl }) {
    Object.assign(this, { title, url, feedUrl });
  }
}
  
export class ItemEntity {
  constructor({ title, url, published }) {
    Object.assign(this, { title, url, published });
  }
}
  
export class CountEntity {
  constructor({ url, count, type }) {
    Object.assign(this, { url, count, type });
  }
}