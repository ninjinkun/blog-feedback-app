export enum CountType {
  Twitter = 'twitter',
  Facebook = 'facebook',
  HatenaBookmark = 'hatenabookmark',
  HatenaStar = 'hatenastar',
  Pocket = 'pocket',
}

export function toServiceURL(type: CountType, url: string): string | null {
  switch (type) {
    case CountType.Twitter:
      return `https://mobile.twitter.com/search?q=${encodeURIComponent(url)}&f=live`;
    case CountType.HatenaBookmark:
      if (url.match(/^https/)) {
        return `http://b.hatena.ne.jp/entry/s/${url.replace(/^https:\/\//, '')}`;
      } else {
        return `http://b.hatena.ne.jp/entry/${url.replace(/^http:\/\//, '')}`;
      }
    case CountType.HatenaStar:
      return `https://s.hatena.ne.jp//mobile/entry?uri=${encodeURIComponent(url)}`;
    default:
      return null;
  }
}
