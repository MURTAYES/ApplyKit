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

    // Exclude checkboxes and radios in Phase 3 (handled in Phase 4)
    if (['checkbox', 'radio'].includes(type)) {
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

  // Safety check: Exclude CAPTCHA fields (R3)
  if (element.closest('[class*="captcha" i], [id*="captcha" i], iframe')) {
    return false;
  }

  const idAndName = `${element.id} ${element.getAttribute('name') || ''} ${element.className || ''}`.toLowerCase();
  if (idAndName.includes('captcha') || idAndName.includes('recaptcha') || idAndName.includes('hcaptcha')) {
    return false;
  }

  // Safety check: Exclude Declaration / Terms / Agreement fields (R4)
  if (
    idAndName.includes('declaration') ||
    idAndName.includes('agree') ||
    idAndName.includes('terms') ||
    idAndName.includes('consent')
  ) {
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
    return isPlaceholderOption(selected);
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

