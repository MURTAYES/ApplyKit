import { describe, it, expect, beforeEach } from 'vitest';
import { matchField } from '../../src/engine/matcher';
import { SiteMapping } from '../../src/types/mapping';

describe('matcher', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('matches basic info fields via explicit label for', () => {
    document.body.innerHTML = `
      <div>
        <label for="appName">Applicant's Name</label>
        <input id="appName" name="applicant_name" />
      </div>
      <div>
        <label for="appBangla">নাম (বাংলা)</label>
        <input id="appBangla" />
      </div>
      <div>
        <label for="nid_no">National ID</label>
        <input id="nid_no" />
      </div>
      <div>
        <label for="mobile_no">Mobile Number</label>
        <input id="mobile_no" />
      </div>
    `;

    const nameInput = document.getElementById('appName') as HTMLInputElement;
    const banglaInput = document.getElementById('appBangla') as HTMLInputElement;
    const nidInput = document.getElementById('nid_no') as HTMLInputElement;
    const mobileInput = document.getElementById('mobile_no') as HTMLInputElement;

    const nameMatch = matchField(nameInput);
    expect(nameMatch).not.toBeNull();
    expect(nameMatch?.profileKey).toBe('basic_info.name_en');
    expect(nameMatch?.confidence).toBeGreaterThanOrEqual(0.65);

    const banglaMatch = matchField(banglaInput);
    expect(banglaMatch).not.toBeNull();
    expect(banglaMatch?.profileKey).toBe('basic_info.name_bn');

    const nidMatch = matchField(nidInput);
    expect(nidMatch).not.toBeNull();
    expect(nidMatch?.profileKey).toBe('basic_info.nid');

    const mobileMatch = matchField(mobileInput);
    expect(mobileMatch).not.toBeNull();
    expect(mobileMatch?.profileKey).toBe('basic_info.mobile');
  });

  it('differentiates SSC vs HSC fields using section scope', () => {
    document.body.innerHTML = `
      <fieldset>
        <legend>SSC Level</legend>
        <div>
          <label for="ssc_roll">Roll No</label>
          <input id="ssc_roll" />
        </div>
        <div>
          <label for="ssc_year">Passing Year</label>
          <input id="ssc_year" />
        </div>
      </fieldset>
      <fieldset>
        <legend>HSC Level</legend>
        <div>
          <label for="hsc_roll">Roll No</label>
          <input id="hsc_roll" />
        </div>
        <div>
          <label for="hsc_year">Passing Year</label>
          <input id="hsc_year" />
        </div>
      </fieldset>
    `;

    const sscRoll = document.getElementById('ssc_roll') as HTMLInputElement;
    const sscYear = document.getElementById('ssc_year') as HTMLInputElement;
    const hscRoll = document.getElementById('hsc_roll') as HTMLInputElement;
    const hscYear = document.getElementById('hsc_year') as HTMLInputElement;

    expect(matchField(sscRoll)?.profileKey).toBe('ssc.roll_no');
    expect(matchField(sscYear)?.profileKey).toBe('ssc.passing_year');
    expect(matchField(hscRoll)?.profileKey).toBe('hsc.roll_no');
    expect(matchField(hscYear)?.profileKey).toBe('hsc.passing_year');
  });

  it('differentiates Present vs Permanent address fields', () => {
    document.body.innerHTML = `
      <h2>Present Address</h2>
      <label for="pres_po">Post Office</label>
      <input id="pres_po" />

      <h2>Permanent Address</h2>
      <label for="perm_po">Post Office</label>
      <input id="perm_po" />
    `;

    const presPo = document.getElementById('pres_po') as HTMLInputElement;
    const permPo = document.getElementById('perm_po') as HTMLInputElement;

    expect(matchField(presPo)?.profileKey).toBe('present_address.post_office');
    expect(matchField(permPo)?.profileKey).toBe('permanent_address.post_office');
  });

  it('applies custom per-site mappings with 1.0 confidence overriding heuristics', () => {
    document.body.innerHTML = `
      <input id="custom_xyz_123" />
    `;

    const customMapping: SiteMapping = {
      domain: 'jobportal.gov.bd',
      fields: {
        applicant: {
          selector: '#custom_xyz_123',
          profileKey: 'basic_info.name_en',
          section: 'basic_info',
        },
      },
    };

    const input = document.getElementById('custom_xyz_123') as HTMLInputElement;
    const match = matchField(input, customMapping);

    expect(match).not.toBeNull();
    expect(match?.profileKey).toBe('basic_info.name_en');
    expect(match?.confidence).toBe(1.0);
    expect(match?.source).toBe('custom_mapping');
  });
});
