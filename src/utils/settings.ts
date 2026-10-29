export const SETTINGS_STORAGE_KEY = "careerpilot-settings";

export type SettingsState = {
  fullName: string;
  email: string;
  targetRole: string;
  preferredLocation: string;
  searchStatus: "actively-looking" | "open-to-opportunities" | "not-looking";
  emailAlerts: boolean;
  weeklyDigest: boolean;
  saveMatchesAutomatically: boolean;
};

export const defaultSettings: SettingsState = {
  fullName: "",
  email: "",
  targetRole: "",
  preferredLocation: "",
  searchStatus: "actively-looking",
  emailAlerts: true,
  weeklyDigest: true,
  saveMatchesAutomatically: false,
};

export function loadSettings(): SettingsState {
  if (typeof window === "undefined") return defaultSettings;

  try {
    const stored = JSON.parse(
      window.localStorage.getItem(SETTINGS_STORAGE_KEY) ?? "null",
    ) as Partial<SettingsState> | null;
    return { ...defaultSettings, ...(stored ?? {}) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: SettingsState) {
  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event("careerpilot:settings-updated"));
}
