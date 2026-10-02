import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { executeFill } from '../../src/engine/fillEngine';
import { getMappingForUrl } from '../../src/engine/siteResolver';
import { Profile, defaultProfile } from '../../src/types/profile';

describe('Master End-to-End Regression Suite (Milestone 1 Final Gate)', () => {
  let fullApplicantProfile: Profile;
  const fixturePath = path.resolve(__dirname, '../fixtures/teletalk_application_form.html');
  const fixtureHtml = fs.readFileSync(fixturePath, 'utf-8');

  beforeEach(() => {
    document.documentElement.innerHTML = fixtureHtml;

    // Simulate portal JS behavior for "+ Add More" dynamic row injection
    const addBtn = document.getElementById('btnAddMoreExp');
    const jobExpContainer = document.getElementById('jobExpContainer');
    let rowCount = 1;

    if (addBtn && jobExpContainer) {
      addBtn.addEventListener('click', () => {
        rowCount++;
        const newTable = document.createElement('table');
        newTable.className = 'job-exp-table';
        newTable.id = `job_row_${rowCount}`;
        newTable.innerHTML = `
          <tr>
            <td width="20%">Employed on</td><td width="2%">:</td>
            <td width="28%">
              <select name="emp_type_${rowCount}" id="emp_type_${rowCount}">
                <option value="">Select</option>
                <option value="1">Regular Basis Under Revenue Budget</option>
                <option value="3">Private Organization</option>
              </select>
            </td>
            <td width="20%">Organization Name</td><td width="2%">:</td>
            <td width="28%"><input type="text" name="organization_${rowCount}" id="organization_${rowCount}" /></td>
          </tr>
          <tr>
            <td>Designation / Post</td><td>:</td>
            <td><input type="text" name="designation_${rowCount}" id="designation_${rowCount}" /></td>
            <td>Office Address</td><td>:</td>
            <td><input type="text" name="org_address_${rowCount}" id="org_address_${rowCount}" /></td>
          </tr>
          <tr>
            <td>Length of Service</td><td>:</td>
            <td colspan="4">
              <input type="text" name="from_date_${rowCount}" id="from_date_${rowCount}" placeholder="MM/DD/YYYY" style="width:120px;" />
              to
              <input type="text" name="to_date_${rowCount}" id="to_date_${rowCount}" placeholder="MM/DD/YYYY" style="width:120px;" />
              <label><input type="checkbox" name="is_current_${rowCount}" id="is_current_${rowCount}" /> CurrentlyWorking</label>
            </td>
          </tr>
          <tr>
            <td>Key Responsibilities</td><td>:</td>
            <td colspan="4"><textarea name="responsibilities_${rowCount}" id="responsibilities_${rowCount}" rows="2"></textarea></td>
          </tr>
        `;
        jobExpContainer.appendChild(newTable);
      });
    }

    fullApplicantProfile = {
      ...defaultProfile,
      basicInfo: {
        nameEn: 'TANIM AHMED',
        nameBn: 'তানিম আহমেদ',
        fatherNameEn: 'LATE ABDUR RAHMAN',
        fatherNameBn: 'মরহুম আবদুর রহমান',
        motherNameEn: 'RASHIDA BEGUM',
        motherNameBn: 'রাশিদা বেগম',
        dob: '1995-10-15',
        gender: 'Male',
        religion: 'Islam',
        maritalStatus: 'Single',
        nationality: 'Bangladeshi',
        quota: 'Non-Quota',
        departmentalStatus: 'None',
        nid: '19952691234567890',
        birthRegistration: '',
        passport: '',
        phone: '01712345678',
        email: 'tanim.ahmed@example.com',
        bloodGroup: 'B+',
      },
      presentAddress: {
        careOf: 'Abdur Rahman',
        village: 'House 42, Road 11, Sector 4',
        district: 'Dhaka',
        upazila: 'Uttara',
        postOffice: 'Uttara HPO',
        postCode: '1230',
      },
      permanentAddress: {
        careOf: '',
        village: '',
        district: '',
        upazila: '',
        postOffice: '',
        postCode: '',
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
        gpa: '4.80',
        group: 'Science',
        passingYear: '2013',
      },
      graduation: {
        exam: 'B.Sc Engineering',
        university: 'BUET',
        subject: 'Computer Science & Engineering',
        resultType: 'CGPA (out of 4)',
        cgpa: '3.75',
        passingYear: '2018',
        courseDuration: '4 Years',
      },
      masters: {
        exam: 'Masters',
        university: 'University of Dhaka',
        subject: 'Computer Science',
        resultType: 'CGPA (out of 4)',
        cgpa: '3.85',
        passingYear: '2020',
        courseDuration: '1 Year',
      },
      jobExperiences: [
        {
          id: 'exp-1',
          organization: 'Apex Solutions Ltd',
          organizationAddress: 'Kawran Bazar, Dhaka',
          designation: 'Senior Software Engineer',
          employmentType: 'Private Organization',
          startDate: '2021-01-01',
          endDate: '2024-03-31',
          isCurrent: false,
          responsibilities: 'Architecting scalable cloud microservices',
        },
        {
          id: 'exp-2',
          organization: 'Innovatech Bangladesh',
          organizationAddress: 'Banani, Dhaka',
          designation: 'Junior Developer',
          employmentType: 'Private Organization',
          startDate: '2018-06-01',
          endDate: '2020-12-31',
          isCurrent: false,
          responsibilities: 'Frontend feature development in React',
        },
      ],
      otherQualifications: {
        computerTypingEn: '45 WPM',
        computerTypingBn: '35 WPM',
        drivingLicense: 'DL-991204',
        extraCurricular: 'National Debate Champion 2017',
      },
    };
  });

  it('executes a full end-to-end form fill with 100% accuracy and zero safety violations', async () => {
    const teletalkMapping = getMappingForUrl('https://alljobs.teletalk.com.bd/apply');
    expect(teletalkMapping).not.toBeNull();

    const report = await executeFill(fullApplicantProfile, document, teletalkMapping || undefined);

    // 1. Basic Info Verification
    const pName = document.querySelector<HTMLInputElement>('#p_name')!;
    const pNameBan = document.querySelector<HTMLInputElement>('#p_name_ban')!;
    const fatherName = document.querySelector<HTMLInputElement>('#father_name')!;
    const motherName = document.querySelector<HTMLInputElement>('#mother_name')!;
    const dob = document.querySelector<HTMLInputElement>('#dob')!;
    const mobile = document.querySelector<HTMLInputElement>('#mobile')!;
    const confMobile = document.querySelector<HTMLInputElement>('#confirm_mobile')!;
    const email = document.querySelector<HTMLInputElement>('#email')!;

    expect(pName.value).toBe('TANIM AHMED');
    expect(pNameBan.value).toBe('তানিম আহমেদ');
    expect(fatherName.value).toBe('LATE ABDUR RAHMAN');
    expect(motherName.value).toBe('RASHIDA BEGUM');
    expect(dob.value).toBe('1995-10-15');
    expect(mobile.value).toBe('01712345678');
    expect(confMobile.value).toBe('01712345678'); // Mirror field verified
    expect(email.value).toBe('tanim.ahmed@example.com');

    // 2. NID Toggle Verification
    const nidSelect = document.querySelector<HTMLSelectElement>('#nid')!;
    const nidNo = document.querySelector<HTMLInputElement>('#nid_no')!;
    expect(nidSelect.value).toBe('1');
    expect(nidNo.value).toBe('19952691234567890');

    // 3. Present & Permanent Address Verification (SPEC-02)
    const presCare = document.querySelector<HTMLInputElement>('#present_care')!;
    const permCare = document.querySelector<HTMLInputElement>('#permanent_care')!;
    const presDist = document.querySelector<HTMLSelectElement>('#present_district')!;
    const permDist = document.querySelector<HTMLSelectElement>('#permanent_district')!;

    expect(presCare.value).toBe('Abdur Rahman');
    expect(permCare.value).toBe('Abdur Rahman'); // Mirrored from present
    expect(presDist.value).toBe('1'); // Dhaka
    expect(permDist.value).toBe('1'); // Dhaka

    // 4. Education Sections Verification
    const sscRoll = document.querySelector<HTMLInputElement>('#ssc_roll')!;
    const sscGpa = document.querySelector<HTMLInputElement>('#ssc_gpa_score')!;
    const hscRoll = document.querySelector<HTMLInputElement>('#hsc_roll')!;
    const graSubject = document.querySelector<HTMLInputElement>('#gra_subject')!;
    const graCgpa = document.querySelector<HTMLInputElement>('#gra_cgpa_score')!;

    expect(sscRoll.value).toBe('102030');
    expect(sscGpa.value).toBe('5.00');
    expect(hscRoll.value).toBe('405060');
    expect(graSubject.value).toBe('Computer Science & Engineering');
    expect(graCgpa.value).toBe('3.75');

    // 5. Masters Section Unlock & Fill Verification
    const masApplicable = document.querySelector<HTMLInputElement>('#mas_applicable')!;
    const masExam = document.querySelector<HTMLSelectElement>('#mas_exam')!;
    const masSubject = document.querySelector<HTMLInputElement>('#mas_subject')!;

    expect(masApplicable.checked).toBe(true);
    expect(masExam.value).toBe('1'); // Masters
    expect(masSubject.value).toBe('Computer Science');

    // 6. Multi-Row Job Experience Expansion Verification (SPEC-01)
    const expTables = document.querySelectorAll('.job-exp-table');
    expect(expTables.length).toBe(2); // Dynamically expanded to 2 rows

    const desig1 = document.querySelector<HTMLInputElement>('#designation_1')!;
    const fromDate1 = document.querySelector<HTMLInputElement>('#from_date_1')!;
    const desig2 = document.querySelector<HTMLInputElement>('#designation_2')!;
    const fromDate2 = document.querySelector<HTMLInputElement>('#from_date_2')!;

    expect(desig1.value).toBe('Senior Software Engineer');
    expect(fromDate1.value).toBe('01/01/2021'); // MM/DD/YYYY format
    expect(desig2.value).toBe('Junior Developer');
    expect(fromDate2.value).toBe('06/01/2018'); // MM/DD/YYYY format

    // 7. Other Qualifications Verification (SPEC-04)
    const typingEn = document.querySelector<HTMLInputElement>('#typing_speed_english')!;
    const typingBn = document.querySelector<HTMLInputElement>('#typing_speed_bangla')!;
    const dl = document.querySelector<HTMLInputElement>('#driving_license_no')!;

    expect(typingEn.value).toBe('45 WPM');
    expect(typingBn.value).toBe('35 WPM');
    expect(dl.value).toBe('DL-991204');

    // 8. Strict Safety Non-Interference Verification (R3, R4)
    const chkDeclaration = document.querySelector<HTMLInputElement>('#chk_declaration')!;
    const captchaCode = document.querySelector<HTMLInputElement>('#captcha_code')!;

    expect(chkDeclaration.checked).toBe(false); // MUST remain unchecked
    expect(captchaCode.value).toBe(''); // MUST remain untouched

    // 9. Telemetry Report Assertion (REPT-01)
    expect(report.filledCount).toBeGreaterThanOrEqual(25);
    expect(report.unmatchedCount).toBe(0);
  });
});
