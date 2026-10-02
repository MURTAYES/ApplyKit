import { Profile } from '../types/profile';
import { SiteMapping } from '../types/mapping';
import { matchField } from './matcher';
import { setNativeValue } from './fieldSetter';
import { isEligibleForFill, isFieldEmpty } from './safety';
import { bengaliToAsciiDigits, normalizeDateValue } from './normalizer';

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
 * Retrieves a nested value from the profile object using a dot-path (e.g. 'basic_info.name_en').
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

/**
 * Executes autofill across all eligible inputs in the DOM tree.
 */
export function executeFill(
  profile: Profile,
  rootElement: Document | HTMLElement = document,
  customMappings?: SiteMapping
): FillReport {
  const inputs = Array.from(
    rootElement.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea')
  );

  const details: FillDetail[] = [];
  let filledCount = 0;
  let skippedCount = 0;
  let unmatchedCount = 0;

  for (const el of inputs) {
    // 1. Safety and eligibility check (R1-R4)
    if (!isEligibleForFill(el)) {
      continue;
    }

    const fieldName = el.getAttribute('name') || el.id || el.getAttribute('aria-label') || el.placeholder || 'Unnamed Field';

    // 2. Strict non-overwrite protection (FILL-05, R5)
    if (!isFieldEmpty(el)) {
      skippedCount++;
      details.push({
        fieldName,
        status: 'skipped_user_filled',
      });
      continue;
    }

    // 3. Match element to profile key (MATCH-01 - MATCH-06)
    const match = matchField(el, customMappings);
    if (!match) {
      unmatchedCount++;
      details.push({
        fieldName,
        status: 'unmatched',
      });
      continue;
    }

    // 4. Resolve value from profile
    const rawValue = resolveProfileValue(profile, match.profileKey);

    // 5. If profile has no data for this field, leave untouched (FILL-04)
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

    // 6. Set native value and dispatch events (FILL-03, FILL-06)
    const formatted = formatValueForInput(el, rawValue);
    setNativeValue(el, formatted);

    filledCount++;
    details.push({
      fieldName,
      profileKey: match.profileKey,
      section: match.section,
      status: 'filled',
    });
  }

  return {
    filledCount,
    skippedCount,
    unmatchedCount,
    details,
  };
}
