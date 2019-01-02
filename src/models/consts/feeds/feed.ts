import { Atom } from './atom';
import { RSS1 } from './rss1';
import { RSS2 } from './rss2';

// xml-js decoded types
export type Feed = RSS1 | RSS2 | Atom;
