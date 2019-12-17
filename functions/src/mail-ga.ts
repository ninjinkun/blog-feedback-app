import * as qs from 'qs';
export function gaImageSrc(userId: string, documentTitle: string, documentPath: string): string {
  const trackingId = 'UA-36926308-2';
  const cid = Math.floor(Math.random() * 0x7FFFFFFF) + "." + Math.floor(Date.now() / 1000);
  const paramString = qs.stringify({
    v: 1,
    tid: trackingId,
    uid: userId,
    cid,
    t: 'event',
    ec: 'email',
    ea: 'open',
    dt: documentTitle,
    dp: documentPath,
  });
  return `http://www.google-analytics.com/collect?${paramString}`;
}
