import unescape from 'lodash/unescape';
import { FeedType } from '../../consts/feed-type';
import { BlogResponse } from '../responses';
import { crossOriginFetch } from './functions';

export async function fetchBlog(blogURL: string): Promise<BlogResponse> {
  const result = await crossOriginFetch(blogURL);
  const htmlText = result.data.body;

  if (!htmlText) {
    throw new Error('Blog not found');
  } else {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    const linkTagSnapshots = doc.evaluate(
      `/html/head/link[@rel='alternate']`,
      doc,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );

    // prefer Atom than RSS
    const feedURLType = detectFeedURLAndType(linkTagSnapshots);
    if (!feedURLType) {
      throw new Error('Feed not found: ' + blogURL);
    }
    const { feedURL: parsedFeedURL, type } = feedURLType;

    // detect HatenaBlog
    const dataBrandAttributeSnapshots = doc.evaluate(
      '/html/@data-admin-domain',
      doc,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    const isHatenaBlog = !!(
      dataBrandAttributeSnapshots.snapshotLength &&
      (dataBrandAttributeSnapshots.snapshotItem(0) as HTMLDataElement).value === '//blog.hatena.ne.jp'
    );

    return {
      title: unescape(doc.title),
      url: blogURL,
      feedURL: feedURL(parsedFeedURL, blogURL),
      feedType: type,
      isHatenaBlog,
    };
  }
}

function detectFeedURLAndType(snapshots: XPathResult): { feedURL: string; type: FeedType } | undefined {
  for (let i = 0; i < snapshots.snapshotLength; i++) {
    const item = snapshots.snapshotItem(i) as HTMLAnchorElement;
    switch (item.type) {
      case 'application/atom+xml':
        return { feedURL: item.href, type: FeedType.Atom };
      case 'application/rss+xml':
        return { feedURL: item.href, type: FeedType.RSS };
      default:
        break;
    }
  }
}

function feedURL(parsedFeedURL: string, baseURL: string) {
  const { host, protocol } = new URL(baseURL);
  const { pathname, search } = new URL(parsedFeedURL);
  return `${protocol}//${host}${pathname}${search}`;
}
