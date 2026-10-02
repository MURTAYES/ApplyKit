import { FieldMatchResult, SectionScope, SiteMapping } from '../types/mapping';
import { normalizeText } from './normalizer';
import { detectSectionScope } from './sectionScoper';

interface FieldRule {
  profileKey: string;
  sectionAllowed?: SectionScope[];
  patterns: string[];
}

const FIELD_RULES: FieldRule[] = [
  // --- BASIC INFO BILINGUAL & CONTACT ---
  {
    profileKey: 'basicInfo.nameBn',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'আবেদনকারীর নাম বাংলায়',
      'আবেদনকারীর নাম বাংলা',
      'আবেদনকারীর নাম',
      'প্রার্থীর নাম বাংলায়',
      'প্রার্থীর নাম বাংলা',
      'প্রার্থীর নাম',
      'নাম বাংলায়',
      'নাম বাংলা',
      'বাংলা নাম',
      'applicants name bangla',
      'applicant name bangla',
      'candidates name bangla',
      'candidate name bangla',
      'name in bangla',
      'name bangla',
      'bangla name',
      'nam bangla',
    ],
  },
  {
    profileKey: 'basicInfo.nameEn',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'applicants name english',
      'applicant name english',
      'applicants name in english',
      'applicant name in english',
      'applicants name',
      'applicant name',
      'candidates name',
      'candidate name',
      'full name',
      'name in english',
      'name english',
      'english name',
      'applicant',
      'candidate',
      'name',
      'আবেদনকারীর নাম ইংরেজি',
      'আবেদনকারীর নাম ইংরেজিতে',
      'প্রার্থীর নাম ইংরেজি',
      'প্রার্থীর নাম ইংরেজিতে',
      'নাম ইংরেজি',
      'নাম ইংরেজিতে',
    ],
  },
  {
    profileKey: 'basicInfo.fatherNameBn',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'পিতার নাম বাংলায়',
      'পিতার নাম বাংলা',
      'পিতার নাম',
      'পিতা বাংলা',
      'পিতা',
      'বাবার নাম বাংলায়',
      'বাবার নাম বাংলা',
      'বাবার নাম',
      'fathers name bangla',
      'father name bangla',
      'fathers name in bangla',
      'father name in bangla',
      'faname bn',
      'faname bangla',
      'fname bn',
      'fname bangla',
      'father bn',
    ],
  },
  {
    profileKey: 'basicInfo.fatherNameEn',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'fathers name english',
      'father name english',
      'fathers name in english',
      'father name in english',
      'fathers name',
      'father name',
      'father',
      'faname',
      'fa name',
      'fname',
      'f name',
      'fathers',
      'name of father',
      'পিতার নাম ইংরেজি',
      'পিতার নাম ইংরেজিতে',
    ],
  },
  {
    profileKey: 'basicInfo.motherNameBn',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'মাতার নাম বাংলায়',
      'মাতার নাম বাংলা',
      'মাতার নাম',
      'মাতা বাংলা',
      'মাতা',
      'মায়ের নাম বাংলায়',
      'মায়ের নাম বাংলায়',
      'মায়ের নাম',
      'মায়ের নাম',
      'mothers name bangla',
      'mother name bangla',
      'mothers name in bangla',
      'mother name in bangla',
      'moname bn',
      'moname bangla',
      'maname bn',
      'maname bangla',
      'mname bn',
      'mname bangla',
      'mother bn',
    ],
  },
  {
    profileKey: 'basicInfo.motherNameEn',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'mothers name english',
      'mother name english',
      'mothers name in english',
      'mother name in english',
      'mothers name',
      'mother name',
      'mother',
      'moname',
      'mo name',
      'maname',
      'ma name',
      'mname',
      'm name',
      'mothers',
      'name of mother',
      'মাতার নাম ইংরেজি',
      'মাতার নাম ইংরেজিতে',
    ],
  },
  {
    profileKey: 'basicInfo.dob',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'date of birth',
      'birth date',
      'dob',
      'জন্ম তারিখ',
      'জন্মতারিখ',
    ],
  },
  {
    profileKey: 'basicInfo.nationality',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'nationality',
      'জাতীয়তা',
    ],
  },
  {
    profileKey: 'basicInfo.gender',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'gender',
      'sex',
      'লিঙ্গ',
    ],
  },
  {
    profileKey: 'basicInfo.maritalStatus',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'marital status',
      'marriage status',
      'marital',
      'বৈবাহিক অবস্থা',
    ],
  },
  {
    profileKey: 'basicInfo.religion',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'religion',
      'ধর্ম',
    ],
  },
  {
    profileKey: 'basicInfo.nid',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'national id',
      'national identity',
      'nid no',
      'nid number',
      'nid',
      'জাতীয় পরিচয়পত্র',
      'জাতীয় পরিচয়পত্র নম্বর',
      'এনআইডি',
    ],
  },
  {
    profileKey: 'basicInfo.birthRegistration',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'birth registration',
      'birth registration no',
      'birth registration number',
      'birth reg',
      'birth certificate',
      'জন্ম নিবন্ধন',
      'জন্ম নিবন্ধন নম্বর',
    ],
  },
  {
    profileKey: 'basicInfo.passport',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'passport id',
      'passport no',
      'passport number',
      'passport',
      'পাসপোর্ট আইডি',
      'পাসপোর্ট নম্বর',
      'পাসপোর্ট',
    ],
  },
  {
    profileKey: 'basicInfo.departmentalStatus',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'departmental status',
      'department status',
      'কর্মরত অবস্থা',
      'বিভাগীয় অবস্থা',
      'বিভাগীয় স্ট্যাটাস',
    ],
  },
  {
    profileKey: 'basicInfo.phone',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'confirm mobile number',
      'confirm mobile',
      're enter mobile',
      'verify mobile',
      'confirm phone',
      'mobile number',
      'mobile no',
      'mobile',
      'phone number',
      'contact no',
      'cell phone',
      'মোবাইল নম্বর',
      'মোবাইল নং',
      'মোবাইল',
      'ফোন',
      'মোবাইল নিশ্চিত',
    ],
  },
  {
    profileKey: 'basicInfo.email',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'email address',
      'e mail address',
      'email',
      'e mail',
      'ইমেইল',
      'ই মেইল',
    ],
  },
  {
    profileKey: 'basicInfo.quota',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'quota',
      'freedom fighter quota',
      'কোটা',
    ],
  },

  // --- ADDRESS SECTION (Present & Permanent) ---
  {
    profileKey: 'presentAddress.careOf',
    sectionAllowed: ['present_address'],
    patterns: ['care of', 'c o', 'c/o', 'অভিভাবক', 'প্রযোজ্য'],
  },
  {
    profileKey: 'permanentAddress.careOf',
    sectionAllowed: ['permanent_address'],
    patterns: ['care of', 'c o', 'c/o', 'অভিভাবক', 'প্রযোজ্য'],
  },
  {
    profileKey: 'presentAddress.village',
    sectionAllowed: ['present_address'],
    patterns: ['village town road', 'village road', 'flat road', 'village', 'road', 'গ্রাম রাস্তা', 'গ্রাম', 'মহল্লা'],
  },
  {
    profileKey: 'permanentAddress.village',
    sectionAllowed: ['permanent_address'],
    patterns: ['village town road', 'village road', 'flat road', 'village', 'road', 'গ্রাম রাস্তা', 'গ্রাম', 'মহল্লা'],
  },
  {
    profileKey: 'presentAddress.postOffice',
    sectionAllowed: ['present_address'],
    patterns: ['post office', 'post name', 'ডাকঘর', 'ডাক ঘর'],
  },
  {
    profileKey: 'permanentAddress.postOffice',
    sectionAllowed: ['permanent_address'],
    patterns: ['post office', 'post name', 'ডাকঘর', 'ডাক ঘর'],
  },
  {
    profileKey: 'presentAddress.postCode',
    sectionAllowed: ['present_address'],
    patterns: ['postal code', 'post code', 'পোস্ট কোড', 'পোস্টকোড'],
  },
  {
    profileKey: 'permanentAddress.postCode',
    sectionAllowed: ['permanent_address'],
    patterns: ['postal code', 'post code', 'পোস্ট কোড', 'পোস্টকোড'],
  },
  {
    profileKey: 'presentAddress.district',
    sectionAllowed: ['present_address'],
    patterns: ['district', 'dist', 'জেলা'],
  },
  {
    profileKey: 'permanentAddress.district',
    sectionAllowed: ['permanent_address'],
    patterns: ['district', 'dist', 'জেলা'],
  },
  {
    profileKey: 'presentAddress.upazila',
    sectionAllowed: ['present_address'],
    patterns: ['upazila thana', 'upazila', 'thana', 'উপজেলা', 'থানা'],
  },
  {
    profileKey: 'permanentAddress.upazila',
    sectionAllowed: ['permanent_address'],
    patterns: ['upazila thana', 'upazila', 'thana', 'উপজেলা', 'থানা'],
  },

  // --- EDUCATION SECTIONS (SSC, HSC, Graduation, Masters) ---
  // SSC
  {
    profileKey: 'ssc.exam',
    sectionAllowed: ['ssc'],
    patterns: ['examination', 'exam', 'examination name', 'পরীক্ষা', 'পরীক্ষার নাম'],
  },
  {
    profileKey: 'ssc.roll',
    sectionAllowed: ['ssc'],
    patterns: ['roll no', 'roll number', 'roll', 'রোল নম্বর', 'রোল'],
  },
  {
    profileKey: 'ssc.board',
    sectionAllowed: ['ssc'],
    patterns: ['board', 'education board', 'বোর্ড'],
  },
  {
    profileKey: 'ssc.group',
    sectionAllowed: ['ssc'],
    patterns: ['group subject', 'group', 'major', 'group major', 'subject', 'বিভাগ', 'গ্রুপ'],
  },
  {
    profileKey: 'ssc.passingYear',
    sectionAllowed: ['ssc'],
    patterns: ['passing year', 'pass year', 'year of passing', 'year', 'পাশের সন', 'পাশের বছর', 'সন'],
  },
  {
    profileKey: 'ssc.gpa',
    sectionAllowed: ['ssc'],
    patterns: ['result gpa', 'gpa', 'result', 'cgpa', 'ফলাফল', 'জিপিএ'],
  },

  // HSC
  {
    profileKey: 'hsc.exam',
    sectionAllowed: ['hsc'],
    patterns: ['examination', 'exam', 'examination name', 'পরীক্ষা', 'পরীক্ষার নাম'],
  },
  {
    profileKey: 'hsc.roll',
    sectionAllowed: ['hsc'],
    patterns: ['roll no', 'roll number', 'roll', 'রোল নম্বর', 'রোল'],
  },
  {
    profileKey: 'hsc.board',
    sectionAllowed: ['hsc'],
    patterns: ['board', 'education board', 'বোর্ড'],
  },
  {
    profileKey: 'hsc.group',
    sectionAllowed: ['hsc'],
    patterns: ['group subject', 'group', 'major', 'group major', 'subject', 'বিভাগ', 'গ্রুপ'],
  },
  {
    profileKey: 'hsc.passingYear',
    sectionAllowed: ['hsc'],
    patterns: ['passing year', 'pass year', 'year of passing', 'year', 'পাশের সন', 'পাশের বছর', 'সন'],
  },
  {
    profileKey: 'hsc.gpa',
    sectionAllowed: ['hsc'],
    patterns: ['result gpa', 'gpa', 'result', 'cgpa', 'ফলাফল', 'জিপিএ'],
  },

  // Graduation
  {
    profileKey: 'graduation.exam',
    sectionAllowed: ['graduation'],
    patterns: ['examination', 'exam', 'examination name', 'পরীক্ষা', 'পরীক্ষার নাম'],
  },
  {
    profileKey: 'graduation.subject',
    sectionAllowed: ['graduation'],
    patterns: ['subject degree', 'subject', 'degree', 'degree name', 'major', 'বিষয়', 'ডিগ্রী'],
  },
  {
    profileKey: 'graduation.university',
    sectionAllowed: ['graduation'],
    patterns: ['institute university', 'university inst', 'university', 'institute', 'college', 'বিশ্ববিদ্যালয়', 'প্রতিষ্ঠান'],
  },
  {
    profileKey: 'graduation.passingYear',
    sectionAllowed: ['graduation'],
    patterns: ['passing year', 'pass year', 'year of passing', 'year', 'পাশের সন', 'পাশের বছর', 'সন'],
  },
  {
    profileKey: 'graduation.cgpa',
    sectionAllowed: ['graduation'],
    patterns: ['result cgpa', 'cgpa', 'result', 'gpa', 'ফলাফল', 'সিজিপিএ'],
  },
  {
    profileKey: 'graduation.courseDuration',
    sectionAllowed: ['graduation'],
    patterns: ['course duration', 'duration', 'course duration years', 'মেয়াদ'],
  },

  // Masters
  {
    profileKey: 'masters.exam',
    sectionAllowed: ['masters'],
    patterns: ['examination', 'exam', 'examination name', 'পরীক্ষা', 'পরীক্ষার নাম'],
  },
  {
    profileKey: 'masters.subject',
    sectionAllowed: ['masters'],
    patterns: ['subject degree', 'subject', 'degree', 'degree name', 'major', 'বিষয়', 'ডিগ্রী'],
  },
  {
    profileKey: 'masters.university',
    sectionAllowed: ['masters'],
    patterns: ['institute university', 'university inst', 'university', 'institute', 'college', 'বিশ্ববিদ্যালয়', 'প্রতিষ্ঠান'],
  },
  {
    profileKey: 'masters.passingYear',
    sectionAllowed: ['masters'],
    patterns: ['passing year', 'pass year', 'year of passing', 'year', 'পাশের সন', 'পাশের বছর', 'সন'],
  },
  {
    profileKey: 'masters.cgpa',
    sectionAllowed: ['masters'],
    patterns: ['result cgpa', 'cgpa', 'result', 'gpa', 'ফলাফল', 'সিজিপিএ'],
  },
  {
    profileKey: 'masters.courseDuration',
    sectionAllowed: ['masters'],
    patterns: ['course duration', 'duration', 'course duration years', 'মেয়াদ'],
  },

  // --- JOB EXPERIENCE SECTION ---
  {
    profileKey: 'jobExperiences.0.organization',
    sectionAllowed: ['job_experience', 'unknown'],
    patterns: [
      'organization name',
      'organization',
      'office name',
      'office',
      'company name',
      'company',
      'firm name',
      'employer name',
      'employer',
      'প্রতিষ্ঠান',
      'প্রতিষ্ঠানের নাম',
    ],
  },
  {
    profileKey: 'jobExperiences.0.organizationAddress',
    sectionAllowed: ['job_experience', 'unknown'],
    patterns: [
      'organization address',
      'office address',
      'company address',
      'employer address',
      'address',
      'প্রতিষ্ঠানের ঠিকানা',
      'ঠিকানা',
    ],
  },
  {
    profileKey: 'jobExperiences.0.designation',
    sectionAllowed: ['job_experience', 'unknown'],
    patterns: [
      'designation post',
      'designation/post',
      'designation',
      'post name',
      'post',
      'job title',
      'পদবী',
      'পদের নাম',
      'পদ',
    ],
  },
  {
    profileKey: 'jobExperiences.0.employmentType',
    sectionAllowed: ['job_experience', 'unknown'],
    patterns: [
      'employed on',
      'employment type',
      'service type',
      'nature of job',
      'nature of service',
      'কর্মসংস্থানের ধরন',
      'কাজের ধরন',
      'চাকরির ধরন',
      'চাকরির প্রকৃতি',
    ],
  },
  {
    profileKey: 'jobExperiences.0.startDate',
    sectionAllowed: ['job_experience', 'unknown'],
    patterns: [
      'service from',
      'start date',
      'from date',
      'from',
      'join date',
      'joining date',
      'শুরুর তারিখ',
      'যোগদানের তারিখ',
    ],
  },
  {
    profileKey: 'jobExperiences.0.endDate',
    sectionAllowed: ['job_experience', 'unknown'],
    patterns: [
      'service to',
      'end date',
      'to date',
      'resign date',
      'শেষ তারিখ',
      'পর্যন্ত',
    ],
  },
  {
    profileKey: 'jobExperiences.0.isCurrent',
    sectionAllowed: ['job_experience', 'unknown'],
    patterns: [
      'currentlyworking',
      'currently working',
      'currently serving',
      'presently working',
      'চলমান',
      'বর্তমানে কর্মরত',
    ],
  },
  {
    profileKey: 'jobExperiences.0.responsibilities',
    sectionAllowed: ['job_experience', 'unknown'],
    patterns: [
      'job description',
      'key responsibilities',
      'responsibilities',
      'duties',
      'duties description',
      'কাজের বিবরণ',
      'দায়িত্ব',
    ],
  },

  // --- OTHER QUALIFICATIONS SECTION ---
  {
    profileKey: 'otherQualifications.computerTypingEn',
    sectionAllowed: ['other_qualifications', 'unknown'],
    patterns: [
      'computer typing speed english',
      'typing speed english',
      'typing speed en',
      'english typing speed',
      'english typing',
      'typing speed in english',
      'টাইপিং স্পিড ইংরেজি',
      'ইংরেজি টাইপিং গতি',
      'ইংরেজি টাইপিং',
    ],
  },
  {
    profileKey: 'otherQualifications.computerTypingBn',
    sectionAllowed: ['other_qualifications', 'unknown'],
    patterns: [
      'computer typing speed bangla',
      'typing speed bangla',
      'typing speed bn',
      'bangla typing speed',
      'bangla typing',
      'typing speed in bangla',
      'টাইপিং স্পিড বাংলা',
      'বাংলা টাইপিং গতি',
      'বাংলা টাইপিং',
    ],
  },
  {
    profileKey: 'otherQualifications.drivingLicense',
    sectionAllowed: ['other_qualifications', 'unknown'],
    patterns: [
      'driving license number',
      'driving license no',
      'driving license',
      'driving licence',
      'ড্রাইভিং লাইসেন্স নম্বর',
      'ড্রাইভিং লাইসেন্স নং',
      'ড্রাইভিং লাইসেন্স',
    ],
  },
  {
    profileKey: 'otherQualifications.extraCurricular',
    sectionAllowed: ['other_qualifications', 'unknown'],
    patterns: [
      'extra curricular activities',
      'extra curricular',
      'extra skills',
      'additional skills',
      'other qualifications',
      'অন্যান্য যোগ্যতা',
      'অন্যান্য দক্ষতা',
    ],
  },
];

interface CandidateText {
  text: string;
  source: FieldMatchResult['source'];
  weight: number;
}

function extractCandidateTexts(element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): CandidateText[] {
  const candidates: CandidateText[] = [];

  // 1. Explicit <label for="id"> (Weight: 1.0)
  if (element.id) {
    const doc = element.ownerDocument;
    if (doc) {
      const label = doc.querySelector(`label[for="${CSS.escape(element.id)}"]`);
      if (label && label.textContent) {
        candidates.push({
          text: normalizeText(label.textContent),
          source: 'label_for',
          weight: 1.0,
        });
      }
    }
  }

  // 2. Enclosing <label> (Weight: 0.95)
  const parentLabel = element.closest('label');
  if (parentLabel && parentLabel.textContent) {
    // Clone label to remove input's own text if any
    const clone = parentLabel.cloneNode(true) as HTMLElement;
    const inputsInClone = clone.querySelectorAll('input, textarea, select');
    inputsInClone.forEach((inp) => inp.remove());
    if (clone.textContent) {
      candidates.push({
        text: normalizeText(clone.textContent),
        source: 'enclosing_label',
        weight: 0.95,
      });
    }
  }

  // 3. aria-label or aria-labelledby (Weight: 0.90)
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) {
    candidates.push({
      text: normalizeText(ariaLabel),
      source: 'aria_label',
      weight: 0.90,
    });
  }
  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const doc = element.ownerDocument;
    const refEl = doc?.getElementById(ariaLabelledBy);
    if (refEl && refEl.textContent) {
      candidates.push({
        text: normalizeText(refEl.textContent),
        source: 'aria_label',
        weight: 0.90,
      });
    }
  }

  // 4. placeholder (Weight: 0.80)
  const placeholder = element.getAttribute('placeholder');
  if (placeholder) {
    candidates.push({
      text: normalizeText(placeholder),
      source: 'placeholder',
      weight: 0.80,
    });
  }

  // 5. name attribute (Weight: 0.75)
  const name = element.getAttribute('name');
  if (name) {
    candidates.push({
      text: normalizeText(name),
      source: 'name_or_id',
      weight: 0.75,
    });
  }

  // 6. id attribute (Weight: 0.75)
  if (element.id) {
    candidates.push({
      text: normalizeText(element.id),
      source: 'name_or_id',
      weight: 0.75,
    });
  }

  // 7. Table cell label traversal (Weight: 0.90)
  const td = element.closest('td, th');
  if (td) {
    let prev = td.previousElementSibling;
    while (prev) {
      const text = normalizeText(prev.textContent || '');
      // Skip empty cells or cells that are just ":" or symbols
      if (text && text !== ':' && text !== '-') {
        candidates.push({
          text,
          source: 'adjacent_text',
          weight: 0.90, // High weight because table labels are authoritative in govt portals
        });
        break;
      }
      prev = prev.previousElementSibling;
    }
  }

  // 8. Preceding sibling element (e.g. <span>Label:</span> <input>)
  let prevEl = element.previousElementSibling;
  while (prevEl) {
    const text = normalizeText(prevEl.textContent || '');
    if (text && text !== ':' && text !== '-') {
      candidates.push({
        text,
        source: 'adjacent_text',
        weight: 0.85,
      });
      break;
    }
    prevEl = prevEl.previousElementSibling;
  }

  // 9. Preceding text node inside same container (e.g. "to [input]")
  let prevNode = element.previousSibling;
  while (prevNode) {
    if (prevNode.nodeType === 3 && prevNode.textContent) {
      const text = normalizeText(prevNode.textContent);
      if (text && text !== ':' && text !== '-') {
        candidates.push({
          text,
          source: 'adjacent_text',
          weight: 0.85,
        });
        break;
      }
    }
    prevNode = prevNode.previousSibling;
  }

  return candidates;
}

function isRuleAllowedForCandidate(profileKey: string, text: string): boolean {
  const isFatherText =
    /\b(father|fathers|fname|faname|fa_name|f_name)\b|পিতা|পিতার|বাবা/i.test(text) ||
    text.includes('father') ||
    text.includes('faname');
  const isMotherText =
    /\b(mother|mothers|mname|moname|maname|mo_name|ma_name|m_name)\b|মাতা|মাতার|মা/i.test(text) ||
    text.includes('mother') ||
    text.includes('moname') ||
    text.includes('maname');
  const isSpouseText = /\b(spouse|husband|wife)\b|স্বামী|স্ত্রী/i.test(text);
  const isBanglaText = /\b(bangla|bengali|bn)\b|বাংলা|বাংলায়/i.test(text);
  const isEnglishText = /\b(english|en)\b|ইংরেজি|ইংরেজিতে/i.test(text);

  const isStartDateText =
    /\b(from|start|join|joining)\b|শুরু|যোগদান/i.test(text) ||
    text.includes('from_date') ||
    text.includes('start_date');
  const isEndDateText =
    /\b(to|end|resign|resignation)\b|শেষ|পর্যন্ত/i.test(text) ||
    text.includes('to_date') ||
    text.includes('end_date');

  // If text mentions start/from, don't match end date
  if (isStartDateText && profileKey.endsWith('.endDate')) {
    return false;
  }
  // If text mentions to/end, don't match start date
  if (isEndDateText && profileKey.endsWith('.startDate')) {
    return false;
  }

  // If text mentions father, don't match applicant or mother
  if (
    isFatherText &&
    (profileKey === 'basicInfo.nameEn' ||
      profileKey === 'basicInfo.nameBn' ||
      profileKey.startsWith('basicInfo.mother'))
  ) {
    return false;
  }
  // If text mentions mother, don't match applicant or father
  if (
    isMotherText &&
    (profileKey === 'basicInfo.nameEn' ||
      profileKey === 'basicInfo.nameBn' ||
      profileKey.startsWith('basicInfo.father'))
  ) {
    return false;
  }
  // If text mentions spouse, don't match applicant, father, or mother
  if (
    isSpouseText &&
    (profileKey.startsWith('basicInfo.name') ||
      profileKey.startsWith('basicInfo.father') ||
      profileKey.startsWith('basicInfo.mother'))
  ) {
    return false;
  }

  // If text explicitly says Bangla, don't match English name keys
  if (
    isBanglaText &&
    (profileKey === 'basicInfo.nameEn' ||
      profileKey === 'basicInfo.fatherNameEn' ||
      profileKey === 'basicInfo.motherNameEn')
  ) {
    return false;
  }
  // If text explicitly says English, don't match Bangla name keys
  if (
    isEnglishText &&
    (profileKey === 'basicInfo.nameBn' ||
      profileKey === 'basicInfo.fatherNameBn' ||
      profileKey === 'basicInfo.motherNameBn')
  ) {
    return false;
  }

  return true;
}

/**
 * Matches an input, textarea, or select element to a profile key.
 */
export function matchField(
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  customMappings?: SiteMapping
): FieldMatchResult | null {
  // 1. Check custom site mappings first (MATCH-05, MATCH-06)
  if (customMappings && customMappings.fields) {
    for (const [key, mapping] of Object.entries(customMappings.fields)) {
      if (element.matches(mapping.selector)) {
        return {
          profileKey: mapping.profileKey,
          confidence: 1.0,
          source: 'custom_mapping',
          section: mapping.section || detectSectionScope(element),
        };
      }
    }
  }

  const detectedSection = detectSectionScope(element);
  const candidates = extractCandidateTexts(element);

  let bestMatch: FieldMatchResult | null = null;
  let highestScore = 0;

  for (const candidate of candidates) {
    if (!candidate.text) continue;

    for (const rule of FIELD_RULES) {
      // Check if rule is permitted in this section
      if (rule.sectionAllowed && !rule.sectionAllowed.includes(detectedSection)) {
        continue;
      }

      // Check context exclusion filters
      if (!isRuleAllowedForCandidate(rule.profileKey, candidate.text)) {
        continue;
      }

      for (const pattern of rule.patterns) {
        let textMatchQuality = 0;

        if (candidate.text === pattern) {
          textMatchQuality = 1.0;
        } else if (
          (candidate.text.startsWith(pattern) || candidate.text.endsWith(pattern)) &&
          pattern !== 'name' &&
          pattern !== 'নাম'
        ) {
          textMatchQuality = 0.9;
        } else if (
          candidate.text.includes(pattern) &&
          pattern.length >= 4 &&
          pattern !== 'name' &&
          pattern !== 'নাম'
        ) {
          textMatchQuality = 0.8;
        }

        if (textMatchQuality > 0) {
          const finalConfidence = candidate.weight * textMatchQuality;
          if (finalConfidence > highestScore) {
            highestScore = finalConfidence;
            bestMatch = {
              profileKey: rule.profileKey,
              confidence: Number(finalConfidence.toFixed(2)),
              source: candidate.source,
              section: detectedSection,
            };
          }
        }
      }
    }
  }

  // Minimum confidence threshold of 0.65 (MATCH-04)
  if (bestMatch && bestMatch.confidence >= 0.65) {
    return bestMatch;
  }

  return null;
}
