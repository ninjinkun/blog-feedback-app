import { DatePickerAndroid } from 'react-native';

export const FEED_TYPE_RSS = 'rss';
export const FEED_TYPE_ATOM = 'atom';

export const COUNT_TYPE_FACEBOOK = 'facebook';
export const COUNT_TYPE_HATENA_BOOKMARK = 'hatenabookmark';

export class BlogResponse {
  constructor(public title: string, public url: string, public feedUrl: string, public feedType: string) {
  }
}

export class ItemResponse {
  constructor(public title: string, public url: string, public published: Date) {
  }
}

export class CountResponse {
  readonly type: string = 'should be implement';
  constructor(public url: string, public count: number) { }
}

export class HatenaBookmarkCountResponse extends CountResponse {
  public readonly type: string = COUNT_TYPE_HATENA_BOOKMARK;
}

export class FacebookCountResponse extends CountResponse {
  public readonly type: string = COUNT_TYPE_FACEBOOK;
}