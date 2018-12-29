import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { saveBlogSetting } from '../../models/repositories/blog-repository';
import { AppState } from '../states/app-state';
import { currenUserOronAuthStateChanged } from './user-action';

export interface SettingSaveSettingRequestAction extends Action {
  type: 'SettingSaveSettingRequestAction';
  blogURL: string;
}

export function settingSaveSettingRequest(blogURL: string): SettingSaveSettingRequestAction {
  return {
    type: 'SettingSaveSettingRequestAction',
    blogURL,
  };
}

export interface SettingSaveSettingResponseAction extends Action {
  type: 'SettingSaveSettinResponseAction';
  blogURL: string;
}

export function settingSaveSettingResponse(blogURL: string): SettingSaveSettingResponseAction {
  return {
    type: 'SettingSaveSettinResponseAction',
    blogURL,
  };
}

export interface SettingSaveSettingErrorAction extends Action {
  type: 'SettingSaveSettingErrorAction';
  blogURL: string;
  error: Error;
}

export function settingSaveSettingError(blogURL: string, error: Error): SettingSaveSettingErrorAction {
  return {
    type: 'SettingSaveSettingErrorAction',
    blogURL,
    error,
  };
}

export type SettingActions =
  | SettingSaveSettingRequestAction
  | SettingSaveSettingResponseAction
  | SettingSaveSettingErrorAction;

type TA = ThunkAction<void, AppState, undefined, SettingActions>;

export function saveSetting(
  auth: firebase.auth.Auth,
  blogURL: string,
  twitterEnabled: boolean,
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
