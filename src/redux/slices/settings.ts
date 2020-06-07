import { createSlice, createNextState, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import { app } from 'firebase';

import { saveBlogSetting } from '../../models/repositories/blog-repository';
import { currenUserOronAuthStateChanged } from './user';

export type SettingState = {
  loading: boolean;
};

export const settingInitialState: SettingState = { loading: false };

export type SettingsState = {
  settings: { [key: string]: SettingState };
};

export const initialState: SettingsState = { settings: {} };

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    saveSettingRequest(state, action: PayloadAction<string>) {},
    saveSettingResponse(
      state,
      action: PayloadAction<{
        blogURL: string;
        twitter: boolean;
        countjsoon: boolean;
        facebook: boolean;
        hatenabookmark: boolean;
        hatenastar: boolean;
        pocket: boolean;
        sendReport: boolean;
      }>
    ) {},
    saveSettingError(state, action: PayloadAction<{ blogURL: string; error: Error }>) {},
    firebaseSendTestReportMailRequest(state, action: PayloadAction<string>) {
      const blogURL = action.payload;
      return updateStates(state, blogURL, { loading: true });
    },
    firebaseSendTestReportMailResponse(state, action: PayloadAction<string>) {
      const blogURL = action.payload;
      return updateStates(state, blogURL, { loading: false });
    },
    firebaseSendTestMailError(state, action: PayloadAction<{ blogURL: string; error: Error }>) {
      const { blogURL } = action.payload;
      return updateStates(state, blogURL, { loading: false });
    },
  },
});

function updateStates(state: SettingsState, blogURL: string, updateState: Partial<SettingState>) {
  return createNextState(state, (draft) => {
    const prevState = draft.settings[blogURL] || settingInitialState;
    const newState = { ...prevState, ...updateState };
    draft.settings[blogURL] = newState;
    return draft;
  });
}

type STA = ThunkAction<void, SettingState, undefined, any>;

export function saveSetting(
  auth: firebase.auth.Auth,
  blogURL: string,
  reportEnabled: boolean,
  twitterEnabled: boolean,
  countJsoonEnabled: boolean,
  facebookEnabled: boolean,
  hatenaBookmarkEnabled: boolean,
  hatenaStarEnabled: boolean,
  pocketEnabled: boolean
): STA {
  return async (dispatch) => {
    dispatch(settingsSlice.actions.saveSettingRequest(blogURL));
    try {
      const user = await currenUserOronAuthStateChanged(auth);
      await saveBlogSetting(
        user.uid,
        blogURL,
        reportEnabled,
        twitterEnabled,
        countJsoonEnabled,
        facebookEnabled,
        hatenaBookmarkEnabled,
        hatenaStarEnabled,
        pocketEnabled
      );
      dispatch(
        settingsSlice.actions.saveSettingResponse({
          blogURL,
          twitter: twitterEnabled,
          countjsoon: countJsoonEnabled,
          facebook: facebookEnabled,
          hatenabookmark: hatenaBookmarkEnabled,
          hatenastar: hatenaStarEnabled,
          pocket: pocketEnabled,
          sendReport: reportEnabled,
        })
      );
    } catch (error) {
      dispatch(settingsSlice.actions.saveSettingError({ blogURL, error }));
    }
  };
}

type MTA = ThunkAction<void, SettingState, undefined, any>;
export function sendTestReportMail(blogURL: string): MTA {
  return async (dispatch) => {
    dispatch(settingsSlice.actions.firebaseSendTestReportMailRequest(blogURL));
    try {
      await app().functions('asia-northeast1').httpsCallable('sendTestReportMail')({ blogURL });
      dispatch(settingsSlice.actions.firebaseSendTestReportMailResponse(blogURL));
    } catch (error) {
      dispatch(settingsSlice.actions.firebaseSendTestMailError({ blogURL, error }));
    }
  };
}
