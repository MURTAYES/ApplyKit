import { describe, it, expect, beforeEach } from 'vitest';
import { executeFill } from '../../src/engine/fillEngine';
import { Profile, defaultProfile } from '../../src/types/profile';

describe('fillEngine - Dropdown & Dependent Selects (Phase 3)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  const sampleProfile: Profile = {
    ...defaultProfile,
    basicInfo: {
      ...defaultProfile.basicInfo,
      nameEn: 'Donna Paulsen',
      nameBn: 'ডোনা পলসেন',
      fatherNameEn: 'James Paulsen',
      fatherNameBn: '',
      motherNameEn: '',
      motherNameBn: '',
      dob: '1975-12-06',
      gender: 'Female',
      maritalStatus: 'Married',
      religion: 'Christianity',
      nid: '1234567890',
      phone: '01811223344',
      email: 'donna@psl.com',
      bloodGroup: 'A+',
      quota: 'Non-Quota',
    },
    presentAddress: {
      careOf: 'Harvey Specter',
      village: 'Lexington Ave',
      postOffice: 'Dhaka PO',
      postCode: '1212',
      district: 'Dhaka',
      upazila: 'Gulshan',
    },
    permanentAddress: {
      careOf: '',
      village: '',
      postOffice: '',
      postCode: '',
      district: 'Chattogram',
      upazila: '',
    },
    ssc: {
      exam: 'SSC',
      roll: '101010',
      board: 'Dhaka',
      group: 'Science',
      passingYear: '1991',
      resultType: 'GPA (out of 5)',
      gpa: '5.00',
    },
    hsc: {
      exam: 'HSC',
      roll: '202020',
      board: 'Cumilla',
      group: 'Science',
      passingYear: '1993',
      resultType: 'GPA (out of 5)',
      gpa: '5.00',
    },
    graduation: {
      exam: 'Honours',
      subject: 'Drama & Literature',
      university: 'Columbia University',
      passingYear: '1997',
      resultType: 'CGPA (out of 4)',
      cgpa: '3.95',
      courseDuration: '4',
    },
    masters: {
      exam: 'Masters',
      subject: '',
      university: '',
      passingYear: '',
      resultType: '',
      cgpa: '',
      courseDuration: '',
    },
    jobExperiences: [],
    otherQualifications: {
      computerTypingEn: '',
      computerTypingBn: '',
      drivingLicense: '',
      extraCurricular: '',
    },
  };

  it('fills native dropdowns using bilingual matching (DROP-01, DROP-02)', async () => {
    document.body.innerHTML = `
      <form id="portal_form">
        <fieldset>
          <legend>Personal Details</legend>
          <div>
            <label for="gender_select">Gender</label>
            <select id="gender_select" name="gender">
              <option value="">-- Select Gender --</option>
              <option value="M">পুরুষ</option>
              <option value="F">মহিলা</option>
              <option value="O">অন্যান্য</option>
            </select>
          </div>
          <div>
            <label for="rel_select">Religion</label>
            <select id="rel_select" name="religion">
              <option value="0">Select Religion</option>
              <option value="1">ইসলাম</option>
              <option value="2">হিন্দু</option>
              <option value="3">খ্রিস্টান</option>
            </select>
          </div>
          <div>
            <label for="quota_select">Quota</label>
            <select id="quota_select" name="quota">
              <option value="">-- Choose Quota --</option>
              <option value="NQ">Non-Quota</option>
              <option value="FF">Freedom Fighter</option>
            </select>
          </div>
        </fieldset>

        <fieldset>
          <legend>SSC Level</legend>
          <div>
            <label for="ssc_board_select">Board</label>
            <select id="ssc_board_select" name="ssc_board">
              <option value="">Select Board</option>
              <option value="DHA">ঢাকা</option>
              <option value="RAJ">Rajshahi</option>
              <option value="COM">কুমিল্লা</option>
            </select>
          </div>
        </fieldset>
      </form>
    `;

    const report = await executeFill(sampleProfile, document);

    const genderSelect = document.getElementById('gender_select') as HTMLSelectElement;
    const relSelect = document.getElementById('rel_select') as HTMLSelectElement;
    const quotaSelect = document.getElementById('quota_select') as HTMLSelectElement;
    const sscBoardSelect = document.getElementById('ssc_board_select') as HTMLSelectElement;

    expect(genderSelect.value).toBe('F'); // Female -> মহিলা -> F
    expect(relSelect.value).toBe('3'); // Christianity -> খ্রিস্টান -> 3
    expect(quotaSelect.value).toBe('NQ'); // Non-Quota -> NQ
    expect(sscBoardSelect.value).toBe('DHA'); // Dhaka -> ঢাকা -> DHA
    expect(report.filledCount).toBe(4);
  });

  it('handles dependent cascading selects with dynamic option loading (DROP-03)', async () => {
    document.body.innerHTML = `
      <form>
        <fieldset>
          <legend>Present Address</legend>
          <div>
            <label for="pres_district">District</label>
            <select id="pres_district" name="district">
              <option value="">-- Select District --</option>
              <option value="10">Dhaka</option>
              <option value="20">Chattogram</option>
            </select>
          </div>
          <div>
            <label for="pres_upazila">Upazila / Thana</label>
            <select id="pres_upazila" name="upazila_thana">
              <option value="">-- Select Upazila --</option>
            </select>
          </div>
        </fieldset>
      </form>
    `;

    const distSelect = document.getElementById('pres_district') as HTMLSelectElement;
    const upaSelect = document.getElementById('pres_upazila') as HTMLSelectElement;

    // Simulate portal page script: when district changes, load upazilas asynchronously
    distSelect.addEventListener('change', () => {
      setTimeout(() => {
        upaSelect.innerHTML = `
          <option value="">-- Select Upazila --</option>
          <option value="1001">Dhanmondi</option>
          <option value="1002">Gulshan</option>
          <option value="1003">Mirpur</option>
        `;
      }, 50);
    });

    const report = await executeFill(sampleProfile, document);

    expect(distSelect.value).toBe('10'); // Dhaka
    expect(upaSelect.value).toBe('1002'); // Gulshan
    expect(report.filledCount).toBe(2);
  });

  it('leaves dropdown untouched if no confident match is found (DROP-04)', async () => {
    document.body.innerHTML = `
      <form>
        <fieldset>
          <legend>Basic Info</legend>
          <div>
            <label for="custom_select">Religion</label>
            <select id="custom_select" name="religion">
              <option value="">-- Select --</option>
              <option value="AAA">SomeUnrelatedOption1</option>
              <option value="BBB">SomeUnrelatedOption2</option>
            </select>
          </div>
        </fieldset>
      </form>
    `;

    const selectEl = document.getElementById('custom_select') as HTMLSelectElement;
    const report = await executeFill(sampleProfile, document);

    expect(selectEl.value).toBe(''); // Left untouched
    expect(report.unmatchedCount).toBe(1);
    expect(report.filledCount).toBe(0);
  });
});
