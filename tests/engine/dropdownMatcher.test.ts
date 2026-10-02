import { describe, it, expect, beforeEach } from 'vitest';
import { findBestOptionMatch, isPlaceholderOption } from '../../src/engine/dropdownMatcher';

describe('Dropdown Matcher', () => {
  let selectEl: HTMLSelectElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    selectEl = document.createElement('select');
    document.body.appendChild(selectEl);
  });

  it('correctly identifies placeholder options', () => {
    const placeholder1 = document.createElement('option');
    placeholder1.value = '';
    placeholder1.text = '-- Select District --';
    expect(isPlaceholderOption(placeholder1)).toBe(true);

    const placeholder2 = document.createElement('option');
    placeholder2.value = '0';
    placeholder2.text = 'Choose One';
    expect(isPlaceholderOption(placeholder2)).toBe(true);

    const placeholder3 = document.createElement('option');
    placeholder3.value = '';
    placeholder3.text = 'নির্বাচন করুন';
    expect(isPlaceholderOption(placeholder3)).toBe(true);

    const realOption = document.createElement('option');
    realOption.value = '10';
    realOption.text = 'Dhaka';
    expect(isPlaceholderOption(realOption)).toBe(false);
  });

  it('matches exact normalized English option (DROP-01)', () => {
    selectEl.innerHTML = `
      <option value="">-- Select Board --</option>
      <option value="1">Dhaka</option>
      <option value="2">Rajshahi</option>
      <option value="3">Cumilla</option>
    `;

    const match = findBestOptionMatch(selectEl, 'rajshahi', 'board');
    expect(match).not.toBeNull();
    expect(match?.option.value).toBe('2');
    expect(match?.option.text).toBe('Rajshahi');
    expect(match?.confidence).toBe(1.0);
  });

  it('matches bilingual English profile value to Bangla dropdown option (DROP-02)', () => {
    selectEl.innerHTML = `
      <option value="0">জেলা নির্বাচন করুন</option>
      <option value="DHA">ঢাকা</option>
      <option value="CTG">চট্টগ্রাম</option>
      <option value="SYL">সিলেট</option>
    `;

    const match = findBestOptionMatch(selectEl, 'Chittagong', 'district');
    expect(match).not.toBeNull();
    expect(match?.option.value).toBe('CTG');
    expect(match?.option.text).toBe('চট্টগ্রাম');
    expect(match?.confidence).toBe(1.0);
  });

  it('matches bilingual Bangla profile value to English dropdown option (DROP-02)', () => {
    selectEl.innerHTML = `
      <option value="">Select Gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    `;

    const match = findBestOptionMatch(selectEl, 'মহিলা', 'gender');
    expect(match).not.toBeNull();
    expect(match?.option.value).toBe('female');
  });

  it('rejects matches with low confidence (DROP-04)', () => {
    selectEl.innerHTML = `
      <option value="">-- Select --</option>
      <option value="1">Khulna</option>
      <option value="2">Barishal</option>
    `;

    const match = findBestOptionMatch(selectEl, 'TotallyUnrelatedValue');
    expect(match).toBeNull();
  });
});
