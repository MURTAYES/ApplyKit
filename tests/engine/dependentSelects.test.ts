import { describe, it, expect, beforeEach } from 'vitest';
import { waitForSelectOptions, hasNonPlaceholderOptions } from '../../src/engine/dependentSelects';

describe('Dependent Selects Waiter', () => {
  let selectEl: HTMLSelectElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    selectEl = document.createElement('select');
    document.body.appendChild(selectEl);
  });

  it('detects when options are already present', async () => {
    selectEl.innerHTML = `
      <option value="0">-- Select Upazila --</option>
      <option value="1">Gulshan</option>
      <option value="2">Dhanmondi</option>
    `;

    expect(hasNonPlaceholderOptions(selectEl)).toBe(true);
    const result = await waitForSelectOptions(selectEl, 200);
    expect(result).toBe(true);
  });

  it('waits for dynamic options added via MutationObserver', async () => {
    selectEl.innerHTML = `<option value="">-- Select Upazila --</option>`;
    expect(hasNonPlaceholderOptions(selectEl)).toBe(false);

    // Simulate Ajax callback adding options after 50ms
    setTimeout(() => {
      const opt = document.createElement('option');
      opt.value = '101';
      opt.text = 'Mirpur';
      selectEl.appendChild(opt);
    }, 50);

    const result = await waitForSelectOptions(selectEl, 500);
    expect(result).toBe(true);
    expect(hasNonPlaceholderOptions(selectEl)).toBe(true);
  });

  it('resolves false on timeout if no options are added', async () => {
    selectEl.innerHTML = `<option value="">-- Select Upazila --</option>`;
    const result = await waitForSelectOptions(selectEl, 100);
    expect(result).toBe(false);
  });
});
