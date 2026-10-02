import { isPlaceholderOption } from './dropdownMatcher';

const COMMON_PLACEHOLDER_PROMPTS = [
  '-- select --',
  '--select--',
  'select one',
  'select...',
  'choose...',
  'type here',
  'enter value',
  '-- নির্বাচন করুন --',
  'নির্বাচন করুন',
];

const DECLARATION_KEYWORDS = [
  'declaration',
  'declare',
  'certify',
  'terms',
  'condition',
  'agree',
  'consent',
  'statement',
  'শর্তাবলী',
  'শর্ত',
  'ঘোষণা',
  'স্বীকার',
  'সত্য পাঠ',
  'শর্ত স্বীকার',
  'i agree',
  'i certify',
  'i declare',
];

/**
 * Checks if an element is a declaration, consent, terms agreement, or CAPTCHA element (R3, R4).
 */
export function isDeclarationOrCaptcha(element: HTMLElement): boolean {
  if (!element) return false;

  // 1. Check CAPTCHA
  if (element.closest('[class*="captcha" i], [id*="captcha" i], iframe')) {
    return true;
  }
  const idAndName = `${element.id} ${element.getAttribute('name') || ''} ${element.className || ''}`.toLowerCase();
  if (idAndName.includes('captcha') || idAndName.includes('recaptcha') || idAndName.includes('hcaptcha')) {
    return true;
  }

  // 2. Check declaration/terms keywords on element attributes
  for (const kw of DECLARATION_KEYWORDS) {
    if (idAndName.includes(kw)) {
      return true;
    }
  }

  // 3. Check enclosing label or container text
  const parentContainer = element.closest('label, td, tr, .form-group, div');
  if (parentContainer) {
    const parentText = (parentContainer.textContent || '').toLowerCase();
    for (const kw of DECLARATION_KEYWORDS) {
      if (parentText.includes(kw)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Checks if an element is safe and eligible for autofilling.
 * Strictly excludes submit, button, reset, hidden, file inputs, CAPTCHAs, and declarations (R1-R4).
 */
export function isEligibleForFill(element: HTMLElement): boolean {
  if (!element) return false;

  const tagName = element.tagName.toUpperCase();

  // Must be an input, textarea, or select
  if (tagName !== 'INPUT' && tagName !== 'TEXTAREA' && tagName !== 'SELECT') {
    return false;
  }

  if (tagName === 'INPUT') {
    const inputEl = element as HTMLInputElement;
    const type = (inputEl.type || 'text').toLowerCase();

    // Exclude buttons, submit, reset, hidden, and file inputs
    if (['submit', 'button', 'reset', 'hidden', 'file', 'image'].includes(type)) {
      return false;
    }

    if (inputEl.disabled || inputEl.readOnly) {
      return false;
    }
  } else if (tagName === 'TEXTAREA') {
    const textEl = element as HTMLTextAreaElement;
    if (textEl.disabled || textEl.readOnly) {
      return false;
    }
  } else if (tagName === 'SELECT') {
    const selectEl = element as HTMLSelectElement;
    if (selectEl.disabled) {
      return false;
    }
  }

  // Safety check: Exclude CAPTCHA and Declaration / Terms fields (R3, R4)
  if (isDeclarationOrCaptcha(element)) {
    return false;
  }

  return true;
}

/**
 * Determines if a field is empty or contains only a placeholder default prompt.
 * Strictly avoids overwriting actual user-entered data (FILL-05, R5).
 */
export function isFieldEmpty(element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): boolean {
  if (!element) {
    return true;
  }

  if (element instanceof HTMLSelectElement) {
    if (element.selectedIndex === -1) {
      return true;
    }
    const selected = element.options[element.selectedIndex];
    if (!selected) {
      return true;
    }
    if (isPlaceholderOption(selected)) {
      return true;
    }
    // If the select is at the initial default option and has empty, 0, or -1 value
    if (element.selectedIndex === 0 && (selected.value === '' || selected.value === '0' || selected.value === '-1')) {
      return true;
    }
    return false;
  }

  if (element instanceof HTMLInputElement && (element.type === 'checkbox' || element.type === 'radio')) {
    // For checkboxes and radios, empty check is handled in fill engine depending on user intent
    return !element.checked;
  }

  if (!element.value) {
    return true;
  }

  const trimmed = element.value.trim();
  if (trimmed === '') {
    return true;
  }

  const lower = trimmed.toLowerCase();
  return COMMON_PLACEHOLDER_PROMPTS.some((prompt) => lower === prompt);
}
