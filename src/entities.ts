export class BlogEntity {
  constructor(public title: string, public url: string, public feedUrl: string) {
  }
}
  
export class ItemEntity {
  constructor(public title: string, public url: string, public published: Date) {
  }
}
  
export class CountEntity {
  constructor(public url: string, public count: string, public type: string) {
  }
}