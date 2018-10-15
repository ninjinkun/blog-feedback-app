import { BlogEntity } from '../../models/entities';

export type BlogState = {
  blogs?: BlogEntity[];
  loading: boolean;
  error?: Error;
};

export const initialState: BlogState = {
  loading: false,
};