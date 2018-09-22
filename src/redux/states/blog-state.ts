import { BlogEntity } from '../../models/entities';

export type BlogState = {
  blogs?: BlogEntity[];
};

export const initialState: BlogState = {};