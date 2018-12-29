import { ThunkAction } from 'redux-thunk';
import { saveBlogSetting } from '../../models/repositories/blog-repository';
import { AppState } from '../states/app-state';
import { currenUserOronAuthStateChanged } from './user-action';

export const FIREBASE_SAVE_SETTING_REQUEST = 'setting/FIREBASE_SAVE_REQUEST';
export function settingSaveSettingRequest(blogURL: string) {
  return {
    type: FIREBASE_SAVE_SETTING_REQUEST as typeof FIREBASE_SAVE_SETTING_REQUEST,
    blogURL,
  };
}
export const FIREBASE_SAVE_SETTING_RESPONSE = 'setting/FIREBASE_SAVE_RESPONSE';
export function settingSaveSettingResponse(blogURL: string) {
  return {
    type: FIREBASE_SAVE_SETTING_RESPONSE as typeof FIREBASE_SAVE_SETTING_RESPONSE,
    blogURL,
  };
}

export const FIREBASE_SAVE_SETTING_ERROR = 'setting/FIREBASE_SAVE_ERROR';
export function settingSaveSettingError(blogURL: string, error: Error) {
  return {
    type: FIREBASE_SAVE_SETTING_ERROR as typeof FIREBASE_SAVE_SETTING_ERROR,
    blogURL,
    error,
  };
}

export type SettingActions =
  | ReturnType<typeof settingSaveSettingRequest>
  | ReturnType<typeof settingSaveSettingResponse>
  | ReturnType<typeof settingSaveSettingError>;

type TA = ThunkAction<void, AppState, undefined, SettingActions>;

export function saveSetting(
  auth: firebase.auth.Auth,
  blogURL: string,
  twitterEnabled: boolean,
  countJsoonEnabled: boolean,
  facebookEnabled: boolean,
  hatenaBookmarkEnabled: boolean,
  hatenaStarEnabled: boolean,
  pocketEnabled: boolean
): TA {
  return async dispatch => {
    dispatch(settingSaveSettingRequest(blogURL));
    try {
      const user = await currenUserOronAuthStateChanged(auth);
      await saveBlogSetting(
        user.uid,
        blogURL,
        twitterEnabled,
        countJsoonEnabled,
        facebookEnabled,
        hatenaBookmarkEnabled,
        hatenaStarEnabled,
        pocketEnabled
      );
      dispatch(settingSaveSettingResponse(blogURL));
    } catch (e) {
      dispatch(settingSaveSettingError(blogURL, e));
    }
  };
}
