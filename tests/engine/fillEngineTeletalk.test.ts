import { describe, it, expect, beforeEach } from 'vitest';
import { executeFill } from '../../src/engine/fillEngine';
import { Profile } from '../../src/types/profile';

describe('fillEngine - Teletalk Portal Layout', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  const fullProfile: Profile = {
    basicInfo: {
      nameEn: 'Tanim Ahmed',
      nameBn: 'তানিম আহমেদ',
      fatherNameEn: 'Rafiq Ahmed',
      fatherNameBn: 'রফিক আহমেদ',
      motherNameEn: 'Nasrin Akter',
      motherNameBn: 'নাসরিন আক্তার',
      dob: '1995-05-12',
      nationality: 'Bangladeshi',
      gender: 'Male',
      nid: '19951234567890',
      birthRegistration: '',
      passport: '',
      phone: '01712345678',
      email: 'tanim@example.com',
      bloodGroup: 'B+',
      religion: 'Islam',
      maritalStatus: 'Single',
      quota: 'Non-Quota',
      departmentalStatus: 'None',
    },
    presentAddress: {
      careOf: 'Rafiq Ahmed',
      village: 'House 12, Road 4, Sector 7',
      district: 'Dhaka',
      upazila: 'Uttara',
      postOffice: 'Uttara PO',
      postCode: '1230',
    },
    permanentAddress: {
      careOf: 'Rafiq Ahmed',
      village: 'Village: Rampur, Post: Rampur',
      district: 'Cumilla',
      upazila: 'Kotwali',
      postOffice: 'Kotwali PO',
      postCode: '3500',
    },
    ssc: {
      exam: 'S.S.C',
      board: 'Dhaka',
      roll: '102030',
      resultType: 'GPA (out of 5)',
      gpa: '5.00',
      group: 'Science',
      passingYear: '2011',
    },
    hsc: {
      exam: 'H.S.C',
      board: 'Dhaka',
      roll: '405060',
      resultType: 'GPA (out of 5)',
      gpa: '5.00',
      group: 'Science',
      passingYear: '2013',
    },
    graduation: {
      exam: 'Honours',
      subject: 'Computer Science',
      university: 'University of Dhaka',
      resultType: 'CGPA (out of 4)',
      cgpa: '3.85',
      passingYear: '2017',
      courseDuration: '4 Years',
    },
    masters: {
      exam: 'Masters',
      subject: 'Computer Science',
      university: 'University of Dhaka',
      resultType: 'CGPA (out of 4)',
      cgpa: '3.90',
      passingYear: '2018',
      courseDuration: '1 Year',
    },
    jobExperiences: [],
    otherQualifications: {
      computerTypingEn: '',
      computerTypingBn: '',
      drivingLicense: '',
      extraCurricular: '',
    },
  };

  it('handles NID/Birth/Passport toggles, dynamic GPA inputs, and Masters section unlock', async () => {
    document.body.innerHTML = `
      <form id="teletalk_job_form">
        <!-- Basic Information -->
        <fieldset>
          <legend>Basic Information</legend>
          <div>
            <label for="name">Applicant's Name</label>
            <input id="name" name="name" type="text" />
          </div>
          <div>
            <label for="name_bn">আবেদনকারীর নাম (বাংলায়)</label>
            <input id="name_bn" name="name_bn" type="text" />
          </div>
          <div>
            <label for="dob">Date of Birth</label>
            <input id="dob" name="dob" type="date" />
          </div>
          <div>
            <label for="nationality">Nationality</label>
            <select id="nationality" name="nationality">
              <option value="">Select</option>
              <option value="Bangladeshi">Bangladeshi</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label for="religion">Religion</label>
            <select id="religion" name="religion">
              <option value="">Select</option>
              <option value="1">Islam</option>
              <option value="2">Hinduism</option>
            </select>
          </div>
          <div>
            <label for="gender">Gender</label>
            <select id="gender" name="gender">
              <option value="">Select</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>

          <!-- NID toggle and dynamic input -->
          <tr id="row_nid">
            <td><label for="nid_opt">National ID</label></td>
            <td>
              <select id="nid_opt" name="nid_opt">
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </td>
            <td>
              <input id="nid_no" name="nid_no" type="text" placeholder="NID No" />
            </td>
          </tr>

          <!-- Birth Reg toggle -->
          <tr id="row_birth">
            <td><label for="birth_opt">Birth Registration</label></td>
            <td>
              <select id="birth_opt" name="birth_opt">
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </td>
          </tr>

          <!-- Passport toggle -->
          <tr id="row_passport">
            <td><label for="passport_opt">Passport ID</label></td>
            <td>
              <select id="passport_opt" name="passport_opt">
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </td>
          </tr>

          <div>
            <label for="mobile">Mobile Number</label>
            <input id="mobile" name="mobile" type="tel" />
          </div>
          <div>
            <label for="confirm_mobile">Confirm Mobile Number</label>
            <input id="confirm_mobile" name="confirm_mobile" type="tel" />
          </div>
        </fieldset>

        <!-- SSC Section -->
        <fieldset>
          <legend>SSC/Equivalent Level</legend>
          <div>
            <label for="ssc_exam">Examination</label>
            <select id="ssc_exam" name="ssc_exam">
              <option value="">Select</option>
              <option value="1">S.S.C</option>
              <option value="2">Dakhil</option>
            </select>
          </div>
          <div>
            <label for="ssc_board">Board</label>
            <select id="ssc_board" name="ssc_board">
              <option value="">Select</option>
              <option value="1">Dhaka</option>
              <option value="2">Cumilla</option>
            </select>
          </div>
          <div>
            <label for="ssc_roll">Roll No</label>
            <input id="ssc_roll" name="ssc_roll" type="text" />
          </div>
          <div class="result-box">
            <label for="ssc_result">Result</label>
            <select id="ssc_result" name="ssc_result">
              <option value="">Select</option>
              <option value="GPA5">GPA (out of 5)</option>
              <option value="DIV1">First Division</option>
            </select>
            <input id="ssc_gpa_score" name="ssc_gpa_score" type="text" />
          </div>
          <div>
            <label for="ssc_group">Group/Subject</label>
            <select id="ssc_group" name="ssc_group">
              <option value="">Select</option>
              <option value="SCI">Science</option>
              <option value="HUM">Humanities</option>
            </select>
          </div>
          <div>
            <label for="ssc_year">Passing Year</label>
            <select id="ssc_year" name="ssc_year">
              <option value="">Select</option>
              <option value="2010">2010</option>
              <option value="2011">2011</option>
            </select>
          </div>
        </fieldset>

        <!-- Masters Section with If Applicable checkbox -->
        <fieldset id="masters_section">
          <legend>Masters/Equivalent Level</legend>
          <label><input type="checkbox" id="masters_applicable" name="masters_applicable" /> If Applicable</label>
          <div>
            <label for="masters_exam">Examination</label>
            <select id="masters_exam" name="masters_exam">
              <option value="">Select</option>
              <option value="1">Masters</option>
              <option value="2">M.Sc</option>
            </select>
          </div>
          <div>
            <label for="masters_sub">Subject/Degree</label>
            <input id="masters_sub" name="masters_sub" type="text" />
          </div>
        </fieldset>
      </form>
    `;

    const report = await executeFill(fullProfile, document);

    // Verify NID toggle is Yes and NID number text input is filled
    const nidOpt = document.getElementById('nid_opt') as HTMLSelectElement;
    const nidNo = document.getElementById('nid_no') as HTMLInputElement;
    expect(nidOpt.value).toBe('yes');
    expect(nidNo.value).toBe('19951234567890');

    // Verify Birth & Passport toggle are No (since profile had no data)
    const birthOpt = document.getElementById('birth_opt') as HTMLSelectElement;
    const passportOpt = document.getElementById('passport_opt') as HTMLSelectElement;
    expect(birthOpt.value).toBe('no');
    expect(passportOpt.value).toBe('no');

    // Verify Nationality, Religion, Gender
    const natSelect = document.getElementById('nationality') as HTMLSelectElement;
    const relSelect = document.getElementById('religion') as HTMLSelectElement;
    const genSelect = document.getElementById('gender') as HTMLSelectElement;
    expect(natSelect.value).toBe('Bangladeshi');
    expect(relSelect.value).toBe('1');
    expect(genSelect.value).toBe('M');

    // Verify Mobile and Confirm Mobile
    const mob = document.getElementById('mobile') as HTMLInputElement;
    const confMob = document.getElementById('confirm_mobile') as HTMLInputElement;
    expect(mob.value).toBe('01712345678');
    expect(confMob.value).toBe('01712345678');

    // Verify SSC dropdowns & dynamic GPA score input
    const sscExam = document.getElementById('ssc_exam') as HTMLSelectElement;
    const sscBoard = document.getElementById('ssc_board') as HTMLSelectElement;
    const sscRoll = document.getElementById('ssc_roll') as HTMLInputElement;
    const sscResult = document.getElementById('ssc_result') as HTMLSelectElement;
    const sscGpaScore = document.getElementById('ssc_gpa_score') as HTMLInputElement;
    const sscGroup = document.getElementById('ssc_group') as HTMLSelectElement;
    const sscYear = document.getElementById('ssc_year') as HTMLSelectElement;

    expect(sscExam.value).toBe('1'); // S.S.C
    expect(sscBoard.value).toBe('1'); // Dhaka
    expect(sscRoll.value).toBe('102030');
    expect(sscResult.value).toBe('GPA5'); // GPA (out of 5)
    expect(sscGpaScore.value).toBe('5.00'); // Dynamic GPA score
    expect(sscGroup.value).toBe('SCI'); // Science
    expect(sscYear.value).toBe('2011'); // 2011

    // Verify Masters checkbox was unlocked and Masters exam filled
    const mastersCb = document.getElementById('masters_applicable') as HTMLInputElement;
    const mastersExam = document.getElementById('masters_exam') as HTMLSelectElement;
    const mastersSub = document.getElementById('masters_sub') as HTMLInputElement;

    expect(mastersCb.checked).toBe(true);
    expect(mastersExam.value).toBe('1'); // Masters
    expect(mastersSub.value).toBe('Computer Science');
  });

  it('correctly unlocks and fills Teletalk Job Experience section', async () => {
    const profileWithExp: Profile = {
      ...fullProfile,
      jobExperiences: [
        {
          id: 'exp-1',
          organization: 'Tech Innovations Ltd',
          organizationAddress: 'Gulshan 2, Dhaka',
          designation: 'Software Engineer',
          employmentType: 'Private Organization',
          startDate: '2019-01-01',
          endDate: '2023-12-31',
          isCurrent: false,
          responsibilities: 'Full stack web application development',
        },
      ],
    };

    document.body.innerHTML = `
      <form id="teletalk_form">
        <fieldset id="job_experience_section">
          <legend>Job Experiences</legend>
          <label><input type="checkbox" id="exp_applicable" name="exp_applicable" /> If Applicable</label>
          
          <table class="job-exp-table">
            <tr>
              <td>Employed on</td>
              <td>:</td>
              <td>
                <select name="emp_type" id="emp_type">
                  <option value="">Select</option>
                  <option value="1">Regular Basis Under Revenue Budget</option>
                  <option value="2">Autonomous/Semi Autonomous Organization</option>
                  <option value="3">Private Organization</option>
                </select>
              </td>
              <td>Organization</td>
              <td>:</td>
              <td><input type="text" name="organization" id="organization" /></td>
            </tr>
            <tr>
              <td>Designation/Post</td>
              <td>:</td>
              <td><input type="text" name="designation" id="designation" /></td>
              <td>Address</td>
              <td>:</td>
              <td><input type="text" name="org_address" id="org_address" /></td>
            </tr>
            <tr>
              <td>Length of Service</td>
              <td>:</td>
              <td colspan="4">
                <input type="text" name="from_date" id="from_date" placeholder="MM/DD/YYYY" />
                to
                <input type="text" name="to_date" id="to_date" placeholder="MM/DD/YYYY" />
                <label><input type="checkbox" name="is_current" id="is_current" /> CurrentlyWorking</label>
              </td>
            </tr>
            <tr>
              <td>Job Description</td>
              <td>:</td>
              <td colspan="4">
                <textarea name="job_description" id="job_description"></textarea>
              </td>
            </tr>
          </table>
        </fieldset>
      </form>
    `;

    const report = await executeFill(profileWithExp, document);

    const expCb = document.getElementById('exp_applicable') as HTMLInputElement;
    const empType = document.getElementById('emp_type') as HTMLSelectElement;
    const org = document.getElementById('organization') as HTMLInputElement;
    const desig = document.getElementById('designation') as HTMLInputElement;
    const orgAddr = document.getElementById('org_address') as HTMLInputElement;
    const fromDate = document.getElementById('from_date') as HTMLInputElement;
    const toDate = document.getElementById('to_date') as HTMLInputElement;
    const jobDesc = document.getElementById('job_description') as HTMLTextAreaElement;

    expect(expCb.checked).toBe(true);
    expect(empType.value).toBe('3'); // Private Organization
    expect(org.value).toBe('Tech Innovations Ltd');
    expect(desig.value).toBe('Software Engineer');
    expect(orgAddr.value).toBe('Gulshan 2, Dhaka');
    expect(fromDate.value).toBe('01/01/2019'); // Formatted to MM/DD/YYYY per placeholder
    expect(toDate.value).toBe('12/31/2023'); // Formatted to MM/DD/YYYY per placeholder
    expect(jobDesc.value).toBe('Full stack web application development');
  });
});
