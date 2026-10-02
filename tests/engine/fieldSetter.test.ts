import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setNativeValue } from '../../src/engine/fieldSetter';

describe('fieldSetter', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('sets value on input element and fires focus, input, change, and blur events', () => {
    document.body.innerHTML = `<input id="testInput" />`;
    const input = document.getElementById('testInput') as HTMLInputElement;

    const eventsFired: string[] = [];
    ['focus', 'input', 'change', 'blur'].forEach((eventName) => {
      input.addEventListener(eventName, () => eventsFired.push(eventName));
    });

    setNativeValue(input, 'Harvey Specter');

    expect(input.value).toBe('Harvey Specter');
    expect(eventsFired).toEqual(['focus', 'input', 'change', 'blur']);
  });

  it('sets value on textarea element and fires bubbling events', () => {
    document.body.innerHTML = `<textarea id="testArea"></textarea>`;
    const textarea = document.getElementById('testArea') as HTMLTextAreaElement;

    const inputListener = vi.fn();
    const changeListener = vi.fn();

    textarea.addEventListener('input', inputListener);
    textarea.addEventListener('change', changeListener);

    setNativeValue(textarea, 'Senior Partner at Pearson Specter Litt');

    expect(textarea.value).toBe('Senior Partner at Pearson Specter Litt');
    expect(inputListener).toHaveBeenCalled();
    expect(changeListener).toHaveBeenCalled();
  });
});
