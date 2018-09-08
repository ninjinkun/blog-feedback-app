import CountType from '../consts/count-type';
import FeedType from '../consts/feed-type';

export class BlogResponse {
  constructor(public title: string, public url: string, public feedUrl: string, public feedType: FeedType) {
  }
}

export class ItemResponse {
  constructor(public title: string, public url: string, public published: Date) {
  }
}

export type CountResponse = {
  type: CountType;
  url: string;
  count: number;
};

export class HatenaBookmarkCountResponse implements CountResponse {
  public readonly type = CountType.HatenaBookmark;
  constructor(public url: string, public count: number) {}
}

export class FacebookCountResponse implements CountResponse {
  public readonly type = CountType.Facebook;
  constructor(public url: string, public count: number) {}
}