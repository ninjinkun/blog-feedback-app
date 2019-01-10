import { SettingState } from './setting-state';

export type SettingsState = {
  settings: { [key: string]: SettingState };
};

export const initialState: SettingsState = { settings: {} };
