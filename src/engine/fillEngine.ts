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
  if (lower.includes('nationality')) return 'nationality';
  if (lower.includes('marital')) return 'maritalstatus';
  if (lower.includes('department')) return 'departmentalstatus';
  if (lower.includes('exam')) return 'exam';
  if (lower.includes('group') || lower.includes('subject')) return 'group';
  if (lower.includes('duration')) return 'courseduration';
  if (lower.includes('result') || lower.includes('gpa') || lower.includes('cgpa')) return 'result';
  return undefined;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Unlocks optional sections like Masters when data is present in profile.
 */
function unlockApplicableSections(profile: Profile, rootElement: Document | HTMLElement): void {
  const hasMastersData = Boolean(
    profile.masters &&
      (profile.masters.exam ||
        profile.masters.subject ||
        profile.masters.university ||
        profile.masters.passingYear ||
        profile.masters.cgpa)
  );

  if (hasMastersData) {
    const checkboxes = Array.from(rootElement.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'));
    for (const cb of checkboxes) {
      const parentText = (cb.closest('div, tr, fieldset, label')?.textContent || '').toLowerCase();
      const idAndName = `${cb.id} ${cb.name}`.toLowerCase();
      if (
        (parentText.includes('master') || parentText.includes('applicable') || idAndName.includes('master')) &&
        !cb.checked
      ) {
        cb.checked = true;
        cb.dispatchEvent(new Event('click', { bubbles: true }));
        cb.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }
}

/**
 * Handles Yes/No toggle dropdowns (such as National ID, Birth Registration, Passport ID)
 * where selecting 'Yes' reveals a text input for entering the number.
 */
async function handleToggleDropdown(
  selectEl: HTMLSelectElement,
  profileValue: string | undefined,
  fieldPattern: string,
  rootElement: Document | HTMLElement
): Promise<{ filled: boolean; numberFilled: boolean }> {
  const hasValue = Boolean(profileValue && profileValue.trim() !== '');
  const targetChoice = hasValue ? 'Yes' : 'No';

  const optionMatch = findBestOptionMatch(selectEl, targetChoice, 'yesno');
  if (optionMatch) {
    setNativeSelectValue(selectEl, optionMatch.option.value);
  }

  if (hasValue && profileValue) {
    // Wait brief interval for dynamic text input to appear/unhide
    await sleep(60);

    // Look for revealed text input in the same row/container or adjacent element
    const container = selectEl.closest('tr, fieldset, .form-group, div') || rootElement;
    const inputs = Array.from(container.querySelectorAll<HTMLInputElement>('input[type="text"], input:not([type])'));

    for (const inp of inputs) {
      const inpName = `${inp.name} ${inp.id} ${inp.getAttribute('aria-label') || ''} ${inp.placeholder || ''}`.toLowerCase();
      if (inpName.includes(fieldPattern) || inputs.length === 1) {
        if (isFieldEmpty(inp)) {
          setNativeValue(inp, bengaliToAsciiDigits(profileValue));
          return { filled: true, numberFilled: true };
        }
      }
    }
    return { filled: true, numberFilled: false };
  }

  return { filled: Boolean(optionMatch), numberFilled: false };
}

/**
 * Executes autofill across all eligible inputs, textareas, and select dropdowns in the DOM tree.
 * Handles dependent dropdowns and dynamic toggle inputs asynchronously.
 */
export async function executeFill(
  profile: Profile,
  rootElement: Document | HTMLElement = document,
  customMappings?: SiteMapping
): Promise<FillReport> {
  // 0. Unlock applicable sections (e.g. Masters)
  unlockApplicableSections(profile, rootElement);
  await sleep(40);

  const allElements = Array.from(
    rootElement.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      'input, textarea, select'
    )
  );

  const details: FillDetail[] = [];
  let filledCount = 0;
  let skippedCount = 0;
  let unmatchedCount = 0;

  // Split elements into primary and dependent child elements (e.g. Upazila)
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

  // 1. Process primary elements
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

    const match = matchField(el as any, customMappings);
    if (!match) {
      unmatchedCount++;
      details.push({
        fieldName,
        status: 'unmatched',
      });
      continue;
    }

    // Special Handling: Toggle Dropdowns (National ID, Birth Registration, Passport ID)
    if (el instanceof HTMLSelectElement) {
      if (match.profileKey === 'basicInfo.nid') {
        const res = await handleToggleDropdown(el, profile.basicInfo.nid, 'nid', rootElement);
        if (res.filled) {
          filledCount++;
          details.push({ fieldName, profileKey: match.profileKey, section: match.section, status: 'filled' });
          if (res.numberFilled) filledCount++;
        }
        continue;
      } else if (match.profileKey === 'basicInfo.birthRegistration') {
        const res = await handleToggleDropdown(el, profile.basicInfo.birthRegistration, 'birth', rootElement);
        if (res.filled) {
          filledCount++;
          details.push({ fieldName, profileKey: match.profileKey, section: match.section, status: 'filled' });
          if (res.numberFilled) filledCount++;
        }
        continue;
      } else if (match.profileKey === 'basicInfo.passport') {
        const res = await handleToggleDropdown(el, profile.basicInfo.passport, 'passport', rootElement);
        if (res.filled) {
          filledCount++;
          details.push({ fieldName, profileKey: match.profileKey, section: match.section, status: 'filled' });
          if (res.numberFilled) filledCount++;
        }
        continue;
      }
    }

    // Resolve value from profile
    let rawValue = resolveProfileValue(profile, match.profileKey);

    // Default nationality if unspecified in profile
    if (!rawValue && match.profileKey === 'basicInfo.nationality') {
      rawValue = 'Bangladeshi';
    }

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
      // Special check: If this is an education result dropdown and profile has GPA/CGPA or resultType
      const categoryHint = deriveCategoryHint(match.profileKey);
      let targetOptionValue = rawValue;

      if (categoryHint === 'result') {
        // If profileKey is ssc.gpa but user has ssc.resultType, use resultType for dropdown
        if (match.section === 'ssc' && profile.ssc.resultType) targetOptionValue = profile.ssc.resultType;
        else if (match.section === 'hsc' && profile.hsc.resultType) targetOptionValue = profile.hsc.resultType;
        else if (match.section === 'graduation' && profile.graduation.resultType) targetOptionValue = profile.graduation.resultType;
        else if (match.section === 'masters' && profile.masters.resultType) targetOptionValue = profile.masters.resultType;
      }

      const optionMatch = findBestOptionMatch(el, targetOptionValue, categoryHint);

      if (optionMatch) {
        setNativeSelectValue(el, optionMatch.option.value);
        filledCount++;
        details.push({
          fieldName,
          profileKey: match.profileKey,
          section: match.section,
          status: 'filled',
        });

        // If result dropdown was set to GPA/CGPA, fill the dynamic GPA text input if present
        if (categoryHint === 'result') {
          await sleep(50);
          const container = el.closest('tr, fieldset, .form-group, div') || rootElement;
          const scoreInputs = Array.from(container.querySelectorAll<HTMLInputElement>('input[type="text"], input:not([type])'));
          let scoreValue = '';
          if (match.section === 'ssc') scoreValue = profile.ssc.gpa;
          else if (match.section === 'hsc') scoreValue = profile.hsc.gpa;
          else if (match.section === 'graduation') scoreValue = profile.graduation.cgpa;
          else if (match.section === 'masters') scoreValue = profile.masters.cgpa;

          if (scoreValue) {
            for (const sInp of scoreInputs) {
              if (isFieldEmpty(sInp)) {
                setNativeValue(sInp, bengaliToAsciiDigits(scoreValue));
                filledCount++;
                break;
              }
            }
          }
        }
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
