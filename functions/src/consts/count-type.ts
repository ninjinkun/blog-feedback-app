export enum CountType {
  Twitter = 'twitter',
  CountJsoon = 'countjsoon',
  Facebook = 'facebook',
  HatenaBookmark = 'hatenabookmark',
  HatenaStar = 'hatenastar',
  Pocket = 'pocket',
}

export function toServiceURL(type: CountType, url: string): string | null {
  switch (type) {
    case CountType.Twitter:
      return `https://twitter.com/search?q=${encodeURIComponent(url)}&f=live`;
    case CountType.CountJsoon:
      return `https://twitter.com/search?q=${encodeURIComponent(url)}&f=live`;
    case CountType.HatenaBookmark:
      if (url.match(/^https/)) {
        return `https://b.hatena.ne.jp/entry/s/${url.replace(/^https:\/\//, '')}`;
      } else {
        return `https://b.hatena.ne.jp/entry/${url.replace(/^http:\/\//, '')}`;
      }
    case CountType.HatenaStar:
      return `https://s.hatena.ne.jp/mobile/entry?uri=${encodeURIComponent(url)}`;
    default:
      return null;
  }
}
