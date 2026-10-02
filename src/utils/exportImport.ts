import { Profile, ProfileSchema } from '../types/profile';

export interface ImportResult {
  success: boolean;
  data?: Profile;
  error?: string;
}

/**
 * Serializes the profile to formatted JSON and triggers a browser file download.
 */
export function exportProfileToJson(profile: Profile): void {
  const jsonStr = JSON.stringify(profile, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `applykit-profile-${dateStr}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Validates and parses raw JSON string into a structured Profile.
 * Rejects malformed JSON or corrupted structures using Zod safeParse.
 */
export function importProfileFromJson(jsonString: string): ImportResult {
  try {
    const rawParsed = JSON.parse(jsonString);
    if (typeof rawParsed !== 'object' || rawParsed === null) {
      return {
        success: false,
        error: 'Invalid file format: JSON root must be an object.',
      };
    }
    const result = ProfileSchema.safeParse(rawParsed);
    if (!result.success) {
      return {
        success: false,
        error: 'Profile validation failed: Incompatible schema format.',
      };
    }
    return {
      success: true,
      data: result.data,
    };
  } catch {
    return {
      success: false,
      error: 'Failed to read JSON: Syntax error or corrupted file.',
    };
  }
}
