import { Profile, ProfileSchema, defaultProfile } from '../types/profile';

export const PROFILE_STORAGE_KEY = 'applykit_profile';
export const LEGACY_STORAGE_KEY = 'donna_profile';

/**
 * Loads the applicant profile from chrome.storage.local.
 * Returns the parsed Profile or defaultProfile if no data is stored or if corrupted.
 */
export async function loadProfile(): Promise<Profile> {
  try {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      return defaultProfile;
    }
    const result = await chrome.storage.local.get([PROFILE_STORAGE_KEY, LEGACY_STORAGE_KEY]);
    const rawData = result[PROFILE_STORAGE_KEY] || result[LEGACY_STORAGE_KEY];
    if (!rawData) {
      return defaultProfile;
    }
    const parseResult = ProfileSchema.safeParse(rawData);
    if (parseResult.success) {
      return parseResult.data;
    }
    return defaultProfile;
  } catch {
    return defaultProfile;
  }
}

/**
 * Persists the applicant profile to chrome.storage.local.
 */
export async function saveProfile(profile: Profile): Promise<boolean> {
  try {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      return false;
    }
    const parseResult = ProfileSchema.safeParse(profile);
    const dataToSave = parseResult.success ? parseResult.data : profile;
    await chrome.storage.local.set({ [PROFILE_STORAGE_KEY]: dataToSave });
    return true;
  } catch {
    return false;
  }
}

/**
 * Removes all applicant profile data from chrome.storage.local.
 */
export async function clearProfile(): Promise<boolean> {
  try {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      return false;
    }
    await chrome.storage.local.remove([PROFILE_STORAGE_KEY, LEGACY_STORAGE_KEY]);
    return true;
  } catch {
    return false;
  }
}
