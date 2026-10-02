import { isPlaceholderOption } from './dropdownMatcher';

/**
 * Checks if a <select> element has at least one selectable, non-placeholder option.
 */
export function hasNonPlaceholderOptions(selectEl: HTMLSelectElement): boolean {
  if (!selectEl || !selectEl.options) return false;
  for (let i = 0; i < selectEl.options.length; i++) {
    if (!isPlaceholderOption(selectEl.options[i])) {
      return true;
    }
  }
  return false;
}

/**
 * Waits for a dependent <select> element to populate options dynamically (e.g. via Ajax or script),
 * using MutationObserver with a polling fallback and configurable timeout.
 */
export function waitForSelectOptions(
  selectEl: HTMLSelectElement,
  timeoutMs = 1000
): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    if (!selectEl) {
      resolve(false);
      return;
    }

    // Check if options are already present
    if (hasNonPlaceholderOptions(selectEl)) {
      resolve(true);
      return;
    }

    let settled = false;
    let observer: MutationObserver | null = null;
    let pollInterval: any = null;
    let timer: any = null;

    const cleanup = () => {
      settled = true;
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    const onReady = () => {
      if (!settled) {
        cleanup();
        resolve(true);
      }
    };

    // 1. MutationObserver to watch for added <option> child nodes
    if (typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver(() => {
        if (hasNonPlaceholderOptions(selectEl)) {
          onReady();
        }
      });
      observer.observe(selectEl, { childList: true, subtree: true });
    }

    // 2. Polling fallback every 50ms in case DOM mutations happen outside observer scope
    pollInterval = setInterval(() => {
      if (hasNonPlaceholderOptions(selectEl)) {
        onReady();
      }
    }, 50);

    // 3. Safety timeout
    timer = setTimeout(() => {
      if (!settled) {
        cleanup();
        resolve(hasNonPlaceholderOptions(selectEl));
      }
    }, timeoutMs);
  });
}

/**
 * Identifies if a field is a parent dependent trigger (e.g., District).
 */
export function isDependentParentKey(profileKey?: string): boolean {
  if (!profileKey) return false;
  return profileKey.endsWith('.district');
}

/**
 * Identifies if a field is a dependent child that waits for parent selection (e.g., Upazila/Thana).
 */
export function isDependentChildKey(profileKey?: string): boolean {
  if (!profileKey) return false;
  return profileKey.endsWith('.upazila_thana') || profileKey.endsWith('.upazila');
}
