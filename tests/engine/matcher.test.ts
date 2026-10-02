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
    expect(nameMatch?.profileKey).toBe('basicInfo.nameEn');
    expect(nameMatch?.confidence).toBeGreaterThanOrEqual(0.65);

    const banglaMatch = matchField(banglaInput);
    expect(banglaMatch).not.toBeNull();
    expect(banglaMatch?.profileKey).toBe('basicInfo.nameBn');

    const nidMatch = matchField(nidInput);
    expect(nidMatch).not.toBeNull();
    expect(nidMatch?.profileKey).toBe('basicInfo.nid');

    const mobileMatch = matchField(mobileInput);
    expect(mobileMatch).not.toBeNull();
    expect(mobileMatch?.profileKey).toBe('basicInfo.phone');
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

    expect(matchField(sscRoll)?.profileKey).toBe('ssc.roll');
    expect(matchField(sscYear)?.profileKey).toBe('ssc.passingYear');
    expect(matchField(hscRoll)?.profileKey).toBe('hsc.roll');
    expect(matchField(hscYear)?.profileKey).toBe('hsc.passingYear');
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

    expect(matchField(presPo)?.profileKey).toBe('presentAddress.postOffice');
    expect(matchField(permPo)?.profileKey).toBe('permanentAddress.postOffice');
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
          profileKey: 'basicInfo.nameEn',
          section: 'basic_info',
        },
      },
    };

    const input = document.getElementById('custom_xyz_123') as HTMLInputElement;
    const match = matchField(input, customMapping);

    expect(match).not.toBeNull();
    expect(match?.profileKey).toBe('basicInfo.nameEn');
    expect(match?.confidence).toBe(1.0);
    expect(match?.source).toBe('custom_mapping');
  });

  it('correctly matches Teletalk bilingual applicant, father, and mother name fields', () => {
    document.body.innerHTML = `
      <div>
        <label for="app_name">Applicant's Name</label>
        <input id="app_name" name="name" />
      </div>
      <div>
        <label for="app_name_bn">আবেদনকারীর নাম (বাংলায়)</label>
        <input id="app_name_bn" name="name_bn" />
      </div>
      <div>
        <label for="father_name">Father's Name</label>
        <input id="father_name" name="father_name" />
      </div>
      <div>
        <label for="father_name_bn">পিতার নাম (বাংলায়)</label>
        <input id="father_name_bn" name="father_name_bn" />
      </div>
      <div>
        <label for="mother_name">Mother's Name</label>
        <input id="mother_name" name="mother_name" />
      </div>
      <div>
        <label for="mother_name_bn">মাতার নাম (বাংলায়)</label>
        <input id="mother_name_bn" name="mother_name_bn" />
      </div>
    `;

    const appName = document.getElementById('app_name') as HTMLInputElement;
    const appNameBn = document.getElementById('app_name_bn') as HTMLInputElement;
    const fatherName = document.getElementById('father_name') as HTMLInputElement;
    const fatherNameBn = document.getElementById('father_name_bn') as HTMLInputElement;
    const motherName = document.getElementById('mother_name') as HTMLInputElement;
    const motherNameBn = document.getElementById('mother_name_bn') as HTMLInputElement;

    expect(matchField(appName)?.profileKey).toBe('basicInfo.nameEn');
    expect(matchField(appNameBn)?.profileKey).toBe('basicInfo.nameBn');
    expect(matchField(fatherName)?.profileKey).toBe('basicInfo.fatherNameEn');
    expect(matchField(fatherNameBn)?.profileKey).toBe('basicInfo.fatherNameBn');
    expect(matchField(motherName)?.profileKey).toBe('basicInfo.motherNameEn');
    expect(matchField(motherNameBn)?.profileKey).toBe('basicInfo.motherNameBn');
  });

  it('correctly matches Teletalk 3-column table layout with faname, moname without label-for tags', () => {
    document.body.innerHTML = `
      <table>
        <tr>
          <td align="left">Applicant's Name</td>
          <td align="center">:</td>
          <td><input type="text" name="name" id="name" /></td>
        </tr>
        <tr>
          <td align="left">আবেদনকারীর নাম (বাংলায়)</td>
          <td align="center">:</td>
          <td><input type="text" name="name_bn" id="name_bn" /></td>
        </tr>
        <tr>
          <td align="left">Father's Name</td>
          <td align="center">:</td>
          <td><input type="text" name="faname" id="faname" /></td>
        </tr>
        <tr>
          <td align="left">পিতার নাম (বাংলায়)</td>
          <td align="center">:</td>
          <td><input type="text" name="faname_bn" id="faname_bn" /></td>
        </tr>
        <tr>
          <td align="left">Mother's Name</td>
          <td align="center">:</td>
          <td><input type="text" name="moname" id="moname" /></td>
        </tr>
        <tr>
          <td align="left">মাতার নাম (বাংলায়)</td>
          <td align="center">:</td>
          <td><input type="text" name="moname_bn" id="moname_bn" /></td>
        </tr>
      </table>
    `;

    const nameInput = document.getElementById('name') as HTMLInputElement;
    const nameBnInput = document.getElementById('name_bn') as HTMLInputElement;
    const faInput = document.getElementById('faname') as HTMLInputElement;
    const faBnInput = document.getElementById('faname_bn') as HTMLInputElement;
    const moInput = document.getElementById('moname') as HTMLInputElement;
    const moBnInput = document.getElementById('moname_bn') as HTMLInputElement;

    expect(matchField(nameInput)?.profileKey).toBe('basicInfo.nameEn');
    expect(matchField(nameBnInput)?.profileKey).toBe('basicInfo.nameBn');
    expect(matchField(faInput)?.profileKey).toBe('basicInfo.fatherNameEn');
    expect(matchField(faBnInput)?.profileKey).toBe('basicInfo.fatherNameBn');
    expect(matchField(moInput)?.profileKey).toBe('basicInfo.motherNameEn');
    expect(matchField(moBnInput)?.profileKey).toBe('basicInfo.motherNameBn');
  });
});
