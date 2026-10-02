import { describe, it, expect, beforeEach } from 'vitest';
import { executeFill } from '../../src/engine/fillEngine';
import { Profile, defaultProfile } from '../../src/types/profile';

describe('fillEngine', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  const mockProfile: Profile = {
    ...defaultProfile,
    basicInfo: {
      ...defaultProfile.basicInfo,
      nameEn: 'Harvey Specter',
      nameBn: 'হার্ভি স্পেক্টার',
      fatherNameEn: 'Gordon Specter',
      fatherNameBn: 'গর্ডন স্পেক্টার',
      motherNameEn: 'Lily Specter',
      motherNameBn: 'লিলি স্পেক্টার',
      dob: '1972-01-22',
      gender: 'Male',
      maritalStatus: 'Married',
      religion: 'Other',
      nid: '1972001122334455',
      phone: '01711223344',
      email: 'harvey@pearsonspecter.com',
      bloodGroup: 'O+',
      quota: '',
    },
    presentAddress: {
      careOf: 'Donna Paulsen',
      village: '601 Lexington Avenue',
      postOffice: 'Manhattan PO',
      postCode: '10022',
      district: 'Dhaka',
      upazila: 'Gulshan',
    },
    permanentAddress: {
      careOf: 'Gordon Specter',
      village: 'Brooklyn Heights',
      postOffice: 'Brooklyn PO',
      postCode: '11201',
      district: 'Dhaka',
      upazila: 'Dhanmondi',
    },
    ssc: {
      exam: 'SSC',
      roll: '102030',
      board: 'Dhaka',
      group: 'Science',
      passingYear: '1988',
      resultType: 'GPA',
      gpa: '5.00',
    },
    hsc: {
      exam: 'HSC',
      roll: '405060',
      board: 'Dhaka',
      group: 'Science',
      passingYear: '1990',
      resultType: 'GPA',
      gpa: '5.00',
    },
    graduation: {
      exam: 'Honours',
      subject: 'LL.B. (Honours)',
      university: 'Harvard Law School',
      passingYear: '1994',
      resultType: 'CGPA',
      cgpa: '4.00',
      courseDuration: '4',
    },
    masters: {
      exam: 'Masters',
      subject: 'LL.M.',
      university: 'Harvard Law School',
      passingYear: '1995',
      resultType: 'CGPA',
      cgpa: '4.00',
      courseDuration: '1',
    },
    jobExperiences: [],
    otherQualifications: {
      computerTypingEn: '',
      computerTypingBn: '',
      drivingLicense: '',
      extraCurricular: '',
    },
  };

  it('fills all matching empty form fields from profile and returns telemetry report', async () => {
    document.body.innerHTML = `
      <form id="gov_app_form">
        <fieldset>
          <legend>Applicant Information</legend>
          <div>
            <label for="app_name">Applicant's Name</label>
            <input id="app_name" type="text" />
          </div>
          <div>
            <label for="app_name_bn">নাম (বাংলা)</label>
            <input id="app_name_bn" type="text" />
          </div>
          <div>
            <label for="app_dob">Date of Birth</label>
            <input id="app_dob" type="date" />
          </div>
          <div>
            <label for="app_nid">National ID</label>
            <input id="app_nid" type="text" />
          </div>
          <div>
            <label for="app_mobile">Mobile Number</label>
            <input id="app_mobile" type="tel" />
          </div>
        </fieldset>

        <fieldset>
          <legend>SSC Level</legend>
          <div>
            <label for="ssc_roll">Roll No</label>
            <input id="ssc_roll" type="text" />
          </div>
          <div>
            <label for="ssc_year">Passing Year</label>
            <input id="ssc_year" type="text" />
          </div>
        </fieldset>

        <fieldset>
          <legend>HSC Level</legend>
          <div>
            <label for="hsc_roll">Roll No</label>
            <input id="hsc_roll" type="text" />
          </div>
          <div>
            <label for="hsc_year">Passing Year</label>
            <input id="hsc_year" type="text" />
          </div>
        </fieldset>

        <!-- Safety checks: submit button and CAPTCHA -->
        <div class="captcha-box">
          <input id="captcha_code" type="text" />
        </div>
        <input type="submit" id="submit_app" value="Submit Application" />
      </form>
    `;

    const report = await executeFill(mockProfile, document);

    // Verify filled counts
    expect(report.filledCount).toBe(9);
    expect(report.unmatchedCount).toBe(0);

    // Verify basic info
    const nameEl = document.getElementById('app_name') as HTMLInputElement;
    const nameBnEl = document.getElementById('app_name_bn') as HTMLInputElement;
    const dobEl = document.getElementById('app_dob') as HTMLInputElement;
    const nidEl = document.getElementById('app_nid') as HTMLInputElement;
    const mobEl = document.getElementById('app_mobile') as HTMLInputElement;

    expect(nameEl.value).toBe('Harvey Specter');
    expect(nameBnEl.value).toBe('হার্ভি স্পেক্টার');
    expect(dobEl.value).toBe('1972-01-22');
    expect(nidEl.value).toBe('1972001122334455');
    expect(mobEl.value).toBe('01711223344');

    // Verify section-scoped SSC vs HSC fields
    const sscRoll = document.getElementById('ssc_roll') as HTMLInputElement;
    const sscYear = document.getElementById('ssc_year') as HTMLInputElement;
    const hscRoll = document.getElementById('hsc_roll') as HTMLInputElement;
    const hscYear = document.getElementById('hsc_year') as HTMLInputElement;

    expect(sscRoll.value).toBe('102030');
    expect(sscYear.value).toBe('1988');
    expect(hscRoll.value).toBe('405060');
    expect(hscYear.value).toBe('1990');

    // Verify CAPTCHA is untouched
    const captchaEl = document.getElementById('captcha_code') as HTMLInputElement;
    expect(captchaEl.value).toBe('');
  });

  it('leaves user pre-typed fields untouched (FILL-05, R5)', async () => {
    document.body.innerHTML = `
      <div>
        <label for="user_email">Email</label>
        <input id="user_email" type="text" value="existing@user.com" />
      </div>
      <div>
        <label for="user_nid">National ID</label>
        <input id="user_nid" type="text" value="" />
      </div>
    `;

    const emailEl = document.getElementById('user_email') as HTMLInputElement;
    const nidEl = document.getElementById('user_nid') as HTMLInputElement;

    const report = await executeFill(mockProfile, document);

    expect(emailEl.value).toBe('existing@user.com'); // Preserved
    expect(nidEl.value).toBe('1972001122334455'); // Filled
    expect(report.skippedCount).toBe(1);
    expect(report.filledCount).toBe(1);
  });
});
