import { Reducer } from 'redux';
import {
  FIREBASE_CALL_SEND_TEST_REPORT_MAIL_ERROR,
  FIREBASE_CALL_SEND_TEST_REPORT_MAIL_REQUEST,
  FIREBASE_CALL_SEND_TEST_REPORT_MAIL_RESPONSE,
  SettingActions,
} from '../actions/setting-action';
import { initialState as settingInitialState, SettingState } from '../states/setting-state';
import { initialState as settingsInitialState, SettingsState } from '../states/settings-state';

export const settingsReducer: Reducer<SettingsState, SettingActions> = (states = settingsInitialState, action) => {
  switch (action.type) {
    case FIREBASE_CALL_SEND_TEST_REPORT_MAIL_REQUEST: {
      const { blogURL } = action;
      return updateStates(states, blogURL, { loading: true });
    }
    case FIREBASE_CALL_SEND_TEST_REPORT_MAIL_RESPONSE: {
      const { blogURL } = action;
      return updateStates(states, blogURL, { loading: false });
    }
    case FIREBASE_CALL_SEND_TEST_REPORT_MAIL_ERROR: {
      const { blogURL } = action;
      return updateStates(states, blogURL, { loading: false });
    }
    default:
      return states;
  }
};

function updateStates(states: SettingsState, blogURL: string, updateState: Partial<SettingState>) {
  const prevState = states.settings[blogURL] || settingInitialState;

  const newState = { ...prevState, ...updateState };
  const settings = states.settings;
  settings[blogURL] = newState;
  return { ...states, settings };
}
