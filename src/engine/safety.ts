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
 * Checks if an element is safe and eligible for autofilling in Phase 2.
 * Strictly excludes submit, button, reset, hidden, file inputs, CAPTCHAs, and declarations (R1-R4).
 */
export function isEligibleForFill(element: HTMLElement): boolean {
  if (!element) return false;

  // Must be an input or textarea
  if (element.tagName !== 'INPUT' && element.tagName !== 'TEXTAREA') {
    return false;
  }

  const inputEl = element as HTMLInputElement;
  const type = (inputEl.type || 'text').toLowerCase();

  // Exclude buttons, submit, reset, hidden, and file inputs
  if (['submit', 'button', 'reset', 'hidden', 'file', 'image'].includes(type)) {
    return false;
  }

  // Exclude checkboxes and radios in Phase 2 (handled in Phase 3/4)
  if (['checkbox', 'radio'].includes(type)) {
    return false;
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

  // Exclude disabled or readonly inputs
  if (inputEl.disabled || inputEl.readOnly) {
    return false;
  }

  return true;
}

/**
 * Determines if a field is empty or contains only a placeholder default prompt.
 * Strictly avoids overwriting actual user-entered data (FILL-05, R5).
 */
export function isFieldEmpty(element: HTMLInputElement | HTMLTextAreaElement): boolean {
  if (!element || !element.value) {
    return true;
  }

  const trimmed = element.value.trim();
  if (trimmed === '') {
    return true;
  }

  const lower = trimmed.toLowerCase();
  return COMMON_PLACEHOLDER_PROMPTS.some((prompt) => lower === prompt);
}
