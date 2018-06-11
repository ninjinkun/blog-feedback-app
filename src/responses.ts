import { DatePickerAndroid } from 'react-native';

export enum FeedType {
  RSS = 'rss',
  Atom = 'atom'
}

export enum CountType {
  Facebook = 'facebook',
  HatenaBookmark = 'hatenabookmark'
}

export class BlogResponse {
  constructor(public title: string, public url: string, public feedUrl: string, public feedType: FeedType) {
  }
}

export class ItemResponse {
  constructor(public title: string, public url: string, public published: Date) {
  }
}

export interface CountResponse {
  type: CountType;
  url: string;
  count: number;
}

export class HatenaBookmarkCountResponse implements CountResponse {
  public readonly type = CountType.HatenaBookmark;
  constructor(public url: string, public count: number) {}
}

export class FacebookCountResponse implements CountResponse {
  public readonly type = CountType.Facebook;
  constructor(public url: string, public count: number) {}
}