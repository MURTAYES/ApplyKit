/**
 * Sets input / textarea value using native prototype property setters
 * so React, Vue, Angular, and vanilla DOM listeners capture the update.
 * Dispatches standard bubbling lifecycle events: focus -> input -> change -> blur.
 */
export function setNativeValue(
  element: HTMLInputElement | HTMLTextAreaElement,
  value: string
): void {
  if (!element) return;

  const prototype = element instanceof HTMLInputElement
    ? window.HTMLInputElement.prototype
    : window.HTMLTextAreaElement.prototype;

  const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');

  if (descriptor && descriptor.set) {
    descriptor.set.call(element, value);
  } else {
    element.value = value;
  }

  // Dispatch lifecycle events to ensure any reactive state bindings update
  element.dispatchEvent(new Event('focus', { bubbles: true }));
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new Event('blur', { bubbles: true }));
}

/**
 * Sets select element value using HTMLSelectElement prototype setter,
 * updates selectedIndex, and dispatches focus -> input -> change -> blur.
 */
export function setNativeSelectValue(
  element: HTMLSelectElement,
  value: string
): void {
  if (!element) return;

  const descriptor = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value');

  if (descriptor && descriptor.set) {
    descriptor.set.call(element, value);
  } else {
    element.value = value;
  }

  element.dispatchEvent(new Event('focus', { bubbles: true }));
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new Event('blur', { bubbles: true }));
}

/**
 * Sets checkbox checked state using native prototype property setter
 * and dispatches click -> input -> change.
 */
export function setNativeCheckboxValue(
  element: HTMLInputElement,
  checked: boolean
): void {
  if (!element || element.type !== 'checkbox') return;

  if (element.checked !== checked) {
    const descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'checked');
    if (descriptor && descriptor.set) {
      descriptor.set.call(element, checked);
    } else {
      element.checked = checked;
    }

    element.dispatchEvent(new Event('click', { bubbles: true }));
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

/**
 * Sets radio button selection by finding the matching radio in the group and selecting it.
 */
export function setNativeRadioValue(
  radios: HTMLInputElement[],
  targetValue: string | boolean
): boolean {
  if (!radios || radios.length === 0) return false;

  const isBool = typeof targetValue === 'boolean';
  const targetStr = String(targetValue).toLowerCase().trim();

  for (const radio of radios) {
    const val = (radio.value || '').toLowerCase().trim();
    const parentText = (radio.closest('label, td, div')?.textContent || '').toLowerCase().trim();

    let matches = false;
    if (isBool) {
      if (
        targetValue === true &&
        (val === '1' || val === 'yes' || val === 'true' || val === 'y' || parentText.includes('yes') || parentText.includes('হ্যাঁ'))
      ) {
        matches = true;
      } else if (
        targetValue === false &&
        (val === '0' || val === 'no' || val === 'false' || val === 'n' || parentText.includes('no') || parentText.includes('না'))
      ) {
        matches = true;
      }
    } else {
      if (val === targetStr || parentText.includes(targetStr)) {
        matches = true;
      }
    }

    if (matches) {
      setNativeCheckboxValue(radio, true);
      return true;
    }
  }

  return false;
}
