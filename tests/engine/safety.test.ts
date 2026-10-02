import { describe, it, expect, beforeEach } from 'vitest';
import { isEligibleForFill, isFieldEmpty } from '../../src/engine/safety';

describe('safety', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('permits text, date, number, and tel inputs', () => {
    document.body.innerHTML = `
      <input type="text" id="t1" />
      <input type="date" id="t2" />
      <input type="number" id="t3" />
      <input type="tel" id="t4" />
      <textarea id="t5"></textarea>
    `;

    ['t1', 't2', 't3', 't4', 't5'].forEach((id) => {
      const el = document.getElementById(id) as HTMLElement;
      expect(isEligibleForFill(el)).toBe(true);
    });
  });

  it('strictly excludes submit, button, reset, hidden, file inputs, CAPTCHA and declarations (R1-R4)', () => {
    document.body.innerHTML = `
      <input type="submit" id="btn_submit" value="Submit Form" />
      <input type="button" id="btn_next" value="Next" />
      <input type="file" id="file_photo" />
      <input type="hidden" id="csrf_token" value="abc" />
      <input type="checkbox" id="chk_agree" name="terms_agree" />
      <input type="text" id="captcha_input" name="captcha" />
    `;

    ['btn_submit', 'btn_next', 'file_photo', 'csrf_token', 'chk_agree', 'captcha_input'].forEach((id) => {
      const el = document.getElementById(id) as HTMLElement;
      expect(isEligibleForFill(el)).toBe(false);
    });
  });

  it('strictly excludes CAPTCHA fields (R3)', () => {
    document.body.innerHTML = `
      <div class="g-recaptcha">
        <input type="text" id="captcha_input" />
      </div>
      <input id="recaptcha_response_field" />
    `;

    const captcha1 = document.getElementById('captcha_input') as HTMLElement;
    const captcha2 = document.getElementById('recaptcha_response_field') as HTMLElement;

    expect(isEligibleForFill(captcha1)).toBe(false);
    expect(isEligibleForFill(captcha2)).toBe(false);
  });

  it('strictly excludes declaration and agreement fields (R4)', () => {
    document.body.innerHTML = `
      <input id="applicant_declaration" type="text" />
      <input name="terms_and_conditions" type="text" />
    `;

    const decl = document.getElementById('applicant_declaration') as HTMLElement;
    const terms = document.querySelector('[name="terms_and_conditions"]') as HTMLElement;

    expect(isEligibleForFill(decl)).toBe(false);
    expect(isEligibleForFill(terms)).toBe(false);
  });

  it('treats placeholder prompts as empty and user typed values as non-empty (R5)', () => {
    document.body.innerHTML = `
      <input id="empty_input" value="" />
      <input id="blank_space" value="   " />
      <input id="prompt_input" value="-- Select --" />
      <input id="bangla_prompt" value="-- নির্বাচন করুন --" />
      <input id="user_typed" value="Donna Paulsen" />
    `;

    const empty = document.getElementById('empty_input') as HTMLInputElement;
    const space = document.getElementById('blank_space') as HTMLInputElement;
    const prompt = document.getElementById('prompt_input') as HTMLInputElement;
    const bnPrompt = document.getElementById('bangla_prompt') as HTMLInputElement;
    const typed = document.getElementById('user_typed') as HTMLInputElement;

    expect(isFieldEmpty(empty)).toBe(true);
    expect(isFieldEmpty(space)).toBe(true);
    expect(isFieldEmpty(prompt)).toBe(true);
    expect(isFieldEmpty(bnPrompt)).toBe(true);
    expect(isFieldEmpty(typed)).toBe(false);
  });
});
