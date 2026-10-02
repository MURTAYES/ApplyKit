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

