import { app } from 'firebase/app';
import { ThunkAction } from 'redux-thunk';
import { saveBlogSetting } from '../../models/repositories/blog-repository';
import { AppState } from '../states/app-state';
import { currenUserOronAuthStateChanged } from './user-action';

export const FIREBASE_SAVE_SETTING_REQUEST = 'setting/FIREBASE_SAVE_REQUEST' as const;
export function settingSaveSettingRequest(blogURL: string) {
  return {
    type: FIREBASE_SAVE_SETTING_REQUEST,
    blogURL,
  };
}
export const FIREBASE_SAVE_SETTING_RESPONSE = 'setting/FIREBASE_SAVE_RESPONSE' as const;
export function settingSaveSettingResponse(
  blogURL: string,
  sendReport: boolean,
  twitter: boolean,
  countjsoon: boolean,
  facebook: boolean,
  hatenabookmark: boolean,
  hatenastar: boolean,
  pocket: boolean
) {
  return {
    type: FIREBASE_SAVE_SETTING_RESPONSE,
    blogURL,
    sendReport,
    twitter,
    countjsoon,
    facebook,
    hatenabookmark,
    hatenastar,
    pocket,
  };
}

export const FIREBASE_SAVE_SETTING_ERROR = 'setting/FIREBASE_SAVE_ERROR' as const;
export function settingSaveSettingError(blogURL: string, error: Error) {
  return {
    type: FIREBASE_SAVE_SETTING_ERROR,
    blogURL,
    error,
  };
}

export type SettingSaveActions =
  | ReturnType<typeof settingSaveSettingRequest>
  | ReturnType<typeof settingSaveSettingResponse>
  | ReturnType<typeof settingSaveSettingError>;

type STA = ThunkAction<void, AppState, undefined, SettingSaveActions>;

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
  return async dispatch => {
    dispatch(settingSaveSettingRequest(blogURL));
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
        settingSaveSettingResponse(
          blogURL,
          reportEnabled,
          twitterEnabled,
          countJsoonEnabled,
          facebookEnabled,
          hatenaBookmarkEnabled,
          hatenaStarEnabled,
          pocketEnabled
        )
      );
    } catch (e) {
      dispatch(settingSaveSettingError(blogURL, e));
    }
  };
}

export const FIREBASE_CALL_SEND_TEST_REPORT_MAIL_REQUEST = 'setting/FIREBASE_CALL_SEND_TEST_REPORT_MAIL_REQUEST';
export function settingCallSendTestReportMailRequest(blogURL: string) {
  return {
    type: FIREBASE_CALL_SEND_TEST_REPORT_MAIL_REQUEST as typeof FIREBASE_CALL_SEND_TEST_REPORT_MAIL_REQUEST,
    blogURL,
  };
}

export const FIREBASE_CALL_SEND_TEST_REPORT_MAIL_RESPONSE = 'setting/FIREBASE_CALL_SEND_TEST_REPORT_MAIL_RESPONSE';
export function settingCallSendTestReportMailResponse(blogURL: string) {
  return {
    type: FIREBASE_CALL_SEND_TEST_REPORT_MAIL_RESPONSE as typeof FIREBASE_CALL_SEND_TEST_REPORT_MAIL_RESPONSE,
    blogURL,
  };
}

export const FIREBASE_CALL_SEND_TEST_REPORT_MAIL_ERROR = 'setting/FIREBASE_CALL_SEND_TEST_REPORT_MAIL_ERROR';
export function settingCallSendTestReportMailError(blogURL: string, error: Error) {
  return {
    type: FIREBASE_CALL_SEND_TEST_REPORT_MAIL_ERROR as typeof FIREBASE_CALL_SEND_TEST_REPORT_MAIL_ERROR,
    blogURL,
    error,
  };
}

export type SettingSendTestReportMailActions =
  | ReturnType<typeof settingCallSendTestReportMailRequest>
  | ReturnType<typeof settingCallSendTestReportMailResponse>
  | ReturnType<typeof settingCallSendTestReportMailError>;

type MTA = ThunkAction<void, AppState, undefined, SettingSendTestReportMailActions>;
export function sendTestReportMail(blogURL: string): MTA {
  return async dispatch => {
    dispatch(settingCallSendTestReportMailRequest(blogURL));
    try {
      await app()
        .functions('asia-northeast1')
        .httpsCallable('sendTestReportMail')({ blogURL });
      dispatch(settingCallSendTestReportMailResponse(blogURL));
    } catch (e) {
      dispatch(settingCallSendTestReportMailError(blogURL, e));
    }
  };
}

export type SettingActions = SettingSaveActions | SettingSendTestReportMailActions;
