export function canonicalize(url: string) {
  // Firebase hosting on production and web browsers return single slash protocol part such as "http:/"
  if (/^http:\/[^\/]/.test(url)) {
    return url.replace(/^http:\//, 'http://');
  } else if (/^https:\/[^\/]/.test(url)) {
    return url.replace(/^https:\//, 'https://');
  } else {
    return url;
  }
}
