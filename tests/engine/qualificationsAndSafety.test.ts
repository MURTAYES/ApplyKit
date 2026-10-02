import { describe, it, expect, beforeEach } from 'vitest';
import { executeFill } from '../../src/engine/fillEngine';
import { isEligibleForFill, isDeclarationOrCaptcha } from '../../src/engine/safety';
import { Profile, defaultProfile } from '../../src/types/profile';

describe('Other Qualifications & Declaration Safety Blacklist (SPEC-04, R4)', () => {
  let sampleProfile: Profile;

  beforeEach(() => {
    document.body.innerHTML = '';
    sampleProfile = JSON.parse(JSON.stringify(defaultProfile));
    sampleProfile.otherQualifications = {
      computerTypingEn: '40 WPM',
      computerTypingBn: '30 WPM',
      drivingLicense: 'DL-8823192',
      extraCurricular: 'Debate Champion',
    };
  });

  it('detects and strictly blacklists declaration and CAPTCHA elements', () => {
    const declarationCb = document.createElement('input');
    declarationCb.type = 'checkbox';
    declarationCb.id = 'chkDeclaration';
    declarationCb.name = 'applicant_declaration';

    const captchaInput = document.createElement('input');
    captchaInput.type = 'text';
    captchaInput.name = 'captcha_code';

    const agreementLabel = document.createElement('label');
    agreementLabel.innerHTML = `<input type="checkbox" id="termsCheck" /> I agree with the terms and conditions and certify all statements are true.`;

    const regularInput = document.createElement('input');
    regularInput.type = 'text';
    regularInput.name = 'applicant_name';

    expect(isDeclarationOrCaptcha(declarationCb)).toBe(true);
    expect(isDeclarationOrCaptcha(captchaInput)).toBe(true);
    expect(isDeclarationOrCaptcha(agreementLabel.querySelector('input')!)).toBe(true);

    expect(isEligibleForFill(declarationCb)).toBe(false);
    expect(isEligibleForFill(captchaInput)).toBe(false);
    expect(isEligibleForFill(agreementLabel.querySelector('input')!)).toBe(false);
    expect(isEligibleForFill(regularInput)).toBe(true);
  });

  it('fills Other Qualifications fields and leaves declaration checkbox untouched', async () => {
    document.body.innerHTML = `
      <form id="qualForm">
        <fieldset>
          <legend>Other Qualifications / অন্যান্য যোগ্যতা</legend>
          <input name="typing_speed_english" placeholder="Computer Typing Speed English" />
          <input name="typing_speed_bangla" placeholder="Computer Typing Speed Bangla" />
          <input name="driving_license_no" placeholder="Driving License Number" />
        </fieldset>

        <!-- Declaration Section -->
        <fieldset>
          <legend>Declaration / অঙ্গীকারনামা</legend>
          <label>
            <input type="checkbox" id="declarationCheckbox" name="declaration" />
            I hereby declare that all the information provided above is true and correct.
          </label>
        </fieldset>
      </form>
    `;

    const declCb = document.querySelector<HTMLInputElement>('#declarationCheckbox')!;
    expect(declCb.checked).toBe(false);

    await executeFill(sampleProfile, document);

    const typingEn = document.querySelector<HTMLInputElement>('input[name="typing_speed_english"]')!;
    const typingBn = document.querySelector<HTMLInputElement>('input[name="typing_speed_bangla"]')!;
    const dl = document.querySelector<HTMLInputElement>('input[name="driving_license_no"]')!;

    expect(typingEn.value).toBe('40 WPM');
    expect(typingBn.value).toBe('30 WPM');
    expect(dl.value).toBe('DL-8823192');

    // Strict R4 constraint check: Declaration checkbox MUST remain untouched
    expect(declCb.checked).toBe(false);
  });
});
