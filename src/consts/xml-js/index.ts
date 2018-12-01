import { Atom } from './atom';
import { RSS1 } from './rss1';
import { RSS2 } from './rss2';

export type Feed = RSS1 | RSS2 | Atom;
