export type UserState = {
  user?: firebase.User,
  loading: boolean,
};

export const initialState: UserState = { loading: false };
