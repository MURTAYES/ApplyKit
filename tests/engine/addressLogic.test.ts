import { describe, it, expect, beforeEach } from 'vitest';
import { executeFill, resolveProfileValue } from '../../src/engine/fillEngine';
import { Profile, defaultProfile } from '../../src/types/profile';

describe('Address Logic & Permanent Address Mirroring', () => {
  let sampleProfile: Profile;

  beforeEach(() => {
    document.body.innerHTML = '';
    sampleProfile = JSON.parse(JSON.stringify(defaultProfile));
    sampleProfile.presentAddress = {
      careOf: 'Late John Doe',
      village: 'House 12, Road 4, Sector 7',
      district: 'Dhaka',
      upazila: 'Uttara',
      postOffice: 'Uttara HPO',
      postCode: '1230',
    };
    // Permanent address intentionally empty to test mirroring (SPEC-02)
    sampleProfile.permanentAddress = {
      careOf: '',
      village: '',
      district: '',
      upazila: '',
      postOffice: '',
      postCode: '',
    };
  });

  it('resolves permanent address from present address when permanent is empty', () => {
    const careOf = resolveProfileValue(sampleProfile, 'permanentAddress.careOf');
    const district = resolveProfileValue(sampleProfile, 'permanentAddress.district');
    const upazila = resolveProfileValue(sampleProfile, 'permanentAddress.upazila');

    expect(careOf).toBe('Late John Doe');
    expect(district).toBe('Dhaka');
    expect(upazila).toBe('Uttara');
  });

  it('fills both present and permanent address sections directly in the DOM without clicking checkbox', async () => {
    document.body.innerHTML = `
      <form id="appForm">
        <!-- Present Address -->
        <fieldset>
          <legend>Present Address / বর্তমান ঠিকানা</legend>
          <input name="present_care" placeholder="Care Of" />
          <input name="present_village" placeholder="Village" />
          <select name="present_dist">
            <option value="">Select District</option>
            <option value="1">Dhaka</option>
            <option value="2">Chattogram</option>
          </select>
        </fieldset>

        <!-- Same as Present Checkbox on Form -->
        <label>
          <input type="checkbox" id="chkSameAsPresent" name="same_as_present" /> Same as Present Address
        </label>

        <!-- Permanent Address -->
        <fieldset>
          <legend>Permanent Address / স্থায়ী ঠিকানা</legend>
          <input name="perm_care" placeholder="Care Of" />
          <input name="perm_village" placeholder="Village" />
          <select name="perm_dist">
            <option value="">Select District</option>
            <option value="1">Dhaka</option>
            <option value="2">Chattogram</option>
          </select>
        </fieldset>
      </form>
    `;

    const sameAsPresentCb = document.querySelector<HTMLInputElement>('#chkSameAsPresent')!;
    expect(sameAsPresentCb.checked).toBe(false);

    const report = await executeFill(sampleProfile, document);

    const presCare = document.querySelector<HTMLInputElement>('input[name="present_care"]')!;
    const permCare = document.querySelector<HTMLInputElement>('input[name="perm_care"]')!;
    const presDist = document.querySelector<HTMLSelectElement>('select[name="present_dist"]')!;
    const permDist = document.querySelector<HTMLSelectElement>('select[name="perm_dist"]')!;

    expect(presCare.value).toBe('Late John Doe');
    expect(permCare.value).toBe('Late John Doe');
    expect(presDist.value).toBe('1');
    expect(permDist.value).toBe('1');

    // Guarantee Donna did NOT click the on-page "same as present" checkbox (SPEC-02)
    expect(sameAsPresentCb.checked).toBe(false);
  });
});
