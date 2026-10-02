import { describe, it, expect, beforeEach } from 'vitest';
import { executeFill } from '../../src/engine/fillEngine';
import { matchField } from '../../src/engine/matcher';
import { Profile, defaultProfile } from '../../src/types/profile';

describe('Mirror and Confirmation Fields Matching (SPEC-03)', () => {
  let sampleProfile: Profile;

  beforeEach(() => {
    document.body.innerHTML = '';
    sampleProfile = JSON.parse(JSON.stringify(defaultProfile));
    sampleProfile.basicInfo.phone = '01711223344';
    sampleProfile.basicInfo.email = 'applicant@example.com';
    sampleProfile.basicInfo.nid = '19951234567890';
  });

  it('matches Confirm Mobile and Confirm Email to primary profile keys', () => {
    const mobileInput = document.createElement('input');
    mobileInput.setAttribute('placeholder', 'Mobile Number');

    const confirmMobileInput = document.createElement('input');
    confirmMobileInput.setAttribute('placeholder', 'Confirm Mobile Number');

    const emailInput = document.createElement('input');
    emailInput.setAttribute('placeholder', 'Email Address');

    const confirmEmailInput = document.createElement('input');
    confirmEmailInput.setAttribute('placeholder', 'Re-type Email Address');

    const match1 = matchField(mobileInput);
    const match2 = matchField(confirmMobileInput);
    const match3 = matchField(emailInput);
    const match4 = matchField(confirmEmailInput);

    expect(match1?.profileKey).toBe('basicInfo.phone');
    expect(match2?.profileKey).toBe('basicInfo.phone');
    expect(match3?.profileKey).toBe('basicInfo.email');
    expect(match4?.profileKey).toBe('basicInfo.email');
  });

  it('fills both primary and confirmation fields with the exact same sanitized value', async () => {
    document.body.innerHTML = `
      <form id="contactForm">
        <div>
          <label for="mob">Mobile Number</label>
          <input id="mob" name="mobile_number" />
        </div>
        <div>
          <label for="confMob">Confirm Mobile Number</label>
          <input id="confMob" name="confirm_mobile" />
        </div>
        <div>
          <label for="em">Email Address</label>
          <input id="em" name="email" />
        </div>
        <div>
          <label for="confEm">Confirm Email</label>
          <input id="confEm" name="confirm_email" />
        </div>
      </form>
    `;

    await executeFill(sampleProfile, document);

    const mob = document.querySelector<HTMLInputElement>('#mob')!;
    const confMob = document.querySelector<HTMLInputElement>('#confMob')!;
    const em = document.querySelector<HTMLInputElement>('#em')!;
    const confEm = document.querySelector<HTMLInputElement>('#confEm')!;

    expect(mob.value).toBe('01711223344');
    expect(confMob.value).toBe('01711223344');
    expect(em.value).toBe('applicant@example.com');
    expect(confEm.value).toBe('applicant@example.com');
  });
});
