import { Profile } from '../types/profile';
import { SiteMapping } from '../types/mapping';
import { matchField } from './matcher';
import { setNativeValue, setNativeSelectValue } from './fieldSetter';
import { isEligibleForFill, isFieldEmpty } from './safety';
import { bengaliToAsciiDigits, normalizeDateValue } from './normalizer';
import { findBestOptionMatch } from './dropdownMatcher';
import { waitForSelectOptions, isDependentChildKey } from './dependentSelects';

export interface FillDetail {
  fieldName: string;
  profileKey?: string;
  status: 'filled' | 'skipped_empty_profile' | 'skipped_user_filled' | 'unmatched';
  section?: string;
}

export interface FillReport {
  filledCount: number;
  skippedCount: number;
  unmatchedCount: number;
  details: FillDetail[];
}

/**
 * Retrieves a nested value from the profile object using a dot-path (e.g. 'basicInfo.nameEn').
 */
function resolveProfileValue(profile: Profile, keyPath: string): string | undefined {
  const parts = keyPath.split('.');
  let current: any = profile;

  for (const part of parts) {
    if (current === undefined || current === null) {
      return undefined;
    }
    current = current[part];
  }

  if (typeof current === 'string') {
    return current.trim();
  }
  if (typeof current === 'number') {
    return String(current);
  }
  return undefined;
}

/**
 * Formats profile value appropriately for the target input element.
 */
function formatValueForInput(input: HTMLInputElement | HTMLTextAreaElement, rawValue: string): string {
  let val = rawValue.normalize('NFC').replace(/[\u200B-\u200D\uFEFF]/g, '');

  if (input instanceof HTMLInputElement) {
    const type = (input.type || 'text').toLowerCase();

    // Convert digits to ASCII for number, tel, and date inputs
    if (type === 'number' || type === 'tel' || type === 'date') {
      val = bengaliToAsciiDigits(val);
    }

    if (type === 'date') {
      val = normalizeDateValue(val, 'YYYY-MM-DD');
    }
  }

  return val;
}

function deriveCategoryHint(profileKey?: string): string | undefined {
  if (!profileKey) return undefined;
  const lower = profileKey.toLowerCase();
  if (lower.includes('district')) return 'district';
  if (lower.includes('board')) return 'board';
  if (lower.includes('religion')) return 'religion';
  if (lower.includes('gender') || lower.includes('sex')) return 'gender';
  if (lower.includes('quota')) return 'quota';
  if (lower.includes('result') || lower.includes('gpa') || lower.includes('cgpa')) return 'result';
  return undefined;
}

/**
 * Executes autofill across all eligible inputs, textareas, and select dropdowns in the DOM tree.
 * Handles dependent dropdowns asynchronously (e.g. District -> Upazila).
 */
export async function executeFill(
  profile: Profile,
  rootElement: Document | HTMLElement = document,
  customMappings?: SiteMapping
): Promise<FillReport> {
  const allElements = Array.from(
    rootElement.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      'input, textarea, select'
    )
  );

  const details: FillDetail[] = [];
  let filledCount = 0;
  let skippedCount = 0;
  let unmatchedCount = 0;

  // Split elements into non-dependent and dependent child elements (e.g. Upazila)
  const primaryElements: HTMLElement[] = [];
  const dependentElements: HTMLSelectElement[] = [];

  for (const el of allElements) {
    if (!isEligibleForFill(el)) {
      continue;
    }

    const match = matchField(el, customMappings);
    if (el instanceof HTMLSelectElement && match && isDependentChildKey(match.profileKey)) {
      dependentElements.push(el);
    } else {
      primaryElements.push(el);
    }
  }

  // 1. Process primary elements (Inputs, Textareas, Independent Dropdowns, Parent District Dropdowns)
  for (const el of primaryElements) {
    const fieldName =
      el.getAttribute('name') || el.id || el.getAttribute('aria-label') || (el as HTMLInputElement).placeholder || 'Unnamed Field';

    // Strict non-overwrite protection (FILL-05, R5)
    if (!isFieldEmpty(el as any)) {
      skippedCount++;
      details.push({
        fieldName,
        status: 'skipped_user_filled',
      });
      continue;
    }

    // Match element to profile key
    const match = matchField(el as any, customMappings);
    if (!match) {
      unmatchedCount++;
      details.push({
        fieldName,
        status: 'unmatched',
      });
      continue;
    }

    // Resolve value from profile
    const rawValue = resolveProfileValue(profile, match.profileKey);

    // If profile has no data for this field, leave untouched (FILL-04)
    if (!rawValue || rawValue.trim() === '') {
      skippedCount++;
      details.push({
        fieldName,
        profileKey: match.profileKey,
        section: match.section,
        status: 'skipped_empty_profile',
      });
      continue;
    }

    if (el instanceof HTMLSelectElement) {
      // Native select dropdown fill (DROP-01, DROP-02, DROP-04)
      const categoryHint = deriveCategoryHint(match.profileKey);
      const optionMatch = findBestOptionMatch(el, rawValue, categoryHint);

      if (optionMatch) {
        setNativeSelectValue(el, optionMatch.option.value);
        filledCount++;
        details.push({
          fieldName,
          profileKey: match.profileKey,
          section: match.section,
          status: 'filled',
        });
      } else {
        unmatchedCount++;
        details.push({
          fieldName,
          profileKey: match.profileKey,
          section: match.section,
          status: 'unmatched',
        });
      }
    } else {
      // Text / Number / Date inputs and Textareas
      const formatted = formatValueForInput(el as HTMLInputElement | HTMLTextAreaElement, rawValue);
      setNativeValue(el as HTMLInputElement | HTMLTextAreaElement, formatted);

      filledCount++;
      details.push({
        fieldName,
        profileKey: match.profileKey,
        section: match.section,
        status: 'filled',
      });
    }
  }

  // 2. Process dependent child dropdowns (e.g. Upazila/Thana) after parent change events have fired
  for (const el of dependentElements) {
    const fieldName =
      el.getAttribute('name') || el.id || el.getAttribute('aria-label') || 'Dependent Dropdown';

    if (!isFieldEmpty(el)) {
      skippedCount++;
      details.push({
        fieldName,
        status: 'skipped_user_filled',
      });
      continue;
    }

    const match = matchField(el, customMappings);
    if (!match) {
      unmatchedCount++;
      details.push({
        fieldName,
        status: 'unmatched',
      });
      continue;
    }

    const rawValue = resolveProfileValue(profile, match.profileKey);
    if (!rawValue || rawValue.trim() === '') {
      skippedCount++;
      details.push({
        fieldName,
        profileKey: match.profileKey,
        section: match.section,
        status: 'skipped_empty_profile',
      });
      continue;
    }

    // Wait for child options to populate dynamically (DROP-03)
    await waitForSelectOptions(el, 800);

    const categoryHint = deriveCategoryHint(match.profileKey);
    const optionMatch = findBestOptionMatch(el, rawValue, categoryHint);

    if (optionMatch) {
      setNativeSelectValue(el, optionMatch.option.value);
      filledCount++;
      details.push({
        fieldName,
        profileKey: match.profileKey,
        section: match.section,
        status: 'filled',
      });
    } else {
      unmatchedCount++;
      details.push({
        fieldName,
        profileKey: match.profileKey,
        section: match.section,
        status: 'unmatched',
      });
    }
  }

  return {
    filledCount,
    skippedCount,
    unmatchedCount,
    details,
  };
}
