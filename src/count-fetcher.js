import fetchJsonp from 'fetch-jsonp'
import { CountResponse, HatenaBookmarkCountResponse, FacebookCountResponse } from './responses';


class CountFetcher {
  static async fetchHatenaBookmarkCounts(urls) {
    const response = await fetchJsonp('http://api.b.st-hatena.com/entry.counts?' + urls.map((i) => "url=" + encodeURIComponent(i)).join('&'))
    const json = await response.json()
    return Object.keys(json).map((url) => new HatenaBookmarkCountResponse({ url: url, count: json[url] }))
  }

  static fetchFacebookCounts(urls) {
    return urls.map((url) => CountFetcher.fetchFacebookCount(url));
  }

  static async fetchFacebookCount(url) {
    const response = await fetch('https://graph.facebook.com/?id=' + encodeURIComponent(url));
    const json = await response.json();
    if (json.hasOwnProperty('share')) {
      return new FacebookCountResponse({ url: json.id, count: json.share.share_count })
    } else {
      throw new Error('Facebook count fetch failed: ' + url)
    }  
  }
}

export default CountFetcher;