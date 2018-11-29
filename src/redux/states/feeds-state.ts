import { FeedState } from './feed-state';

export type FeedStates = { [key: string]: FeedState };

export type FeedsState = {
  feeds: FeedStates;
  currentBlogURL?: string;
};

export const initialState = {
  feeds: {},
};
