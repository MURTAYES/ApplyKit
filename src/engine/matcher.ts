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
    profileKey: 'basic_info.name_bn',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'nam bangla',
      'name bangla',
      'name in bangla',
      'bangla name',
      'applicants name bangla',
      'নাম বাংলা',
      'প্রার্থীর নাম বাংলা',
      'বাংলা নাম',
    ],
  },
  {
    profileKey: 'basic_info.name_en',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'name english',
      'name in english',
      'applicants name',
      'applicant name',
      'candidate name',
      'full name',
      'name',
      'নাম',
      'প্রার্থীর নাম',
      'আবেদনকারীর নাম',
    ],
  },
  {
    profileKey: 'basic_info.father_name_bn',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'father name bangla',
      'fathers name bangla',
      'পিতার নাম বাংলা',
      'পিতা বাংলা',
    ],
  },
  {
    profileKey: 'basic_info.father_name_en',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'father name',
      'fathers name',
      'father',
      'পিতার নাম',
      'পিতা',
    ],
  },
  {
    profileKey: 'basic_info.mother_name_bn',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'mother name bangla',
      'mothers name bangla',
      'মাতার নাম বাংলা',
      'মাতা বাংলা',
    ],
  },
  {
    profileKey: 'basic_info.mother_name_en',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'mother name',
      'mothers name',
      'mother',
      'মাতার নাম',
      'মাতা',
    ],
  },
  {
    profileKey: 'basic_info.dob',
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
    profileKey: 'basic_info.gender',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'gender',
      'sex',
      'লিঙ্গ',
    ],
  },
  {
    profileKey: 'basic_info.marital_status',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'marital status',
      'marriage status',
      'বৈবাহিক অবস্থা',
    ],
  },
  {
    profileKey: 'basic_info.religion',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'religion',
      'ধর্ম',
    ],
  },
  {
    profileKey: 'basic_info.nid',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'national id',
      'national identity',
      'nid no',
      'nid number',
      'nid',
      'জাতীয় পরিচয়পত্র',
      'এনআইডি',
    ],
  },
  {
    profileKey: 'basic_info.passport',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'passport no',
      'passport number',
      'passport',
      'পাসপোর্ট নম্বর',
      'পাসপোর্ট',
    ],
  },
  {
    profileKey: 'basic_info.birth_reg',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'birth registration',
      'birth certificate',
      'birth reg no',
      'জন্ম নিবন্ধন নম্বর',
      'জন্ম নিবন্ধন',
      'জন্ম সনদ',
    ],
  },
  {
    profileKey: 'basic_info.confirm_mobile',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'confirm mobile',
      're enter mobile',
      'verify mobile',
      'confirm phone',
      'মোবাইল নিশ্চিত',
      'মোবাইল পুনঃপ্রবেশ',
    ],
  },
  {
    profileKey: 'basic_info.mobile',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
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
    ],
  },
  {
    profileKey: 'basic_info.email',
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
    profileKey: 'basic_info.quota',
    sectionAllowed: ['basic_info', 'unknown'],
    patterns: [
      'quota',
      'freedom fighter quota',
      'কোটা',
    ],
  },

  // --- ADDRESS SECTION (Present & Permanent) ---
  {
    profileKey: 'present_address.care_of',
    sectionAllowed: ['present_address'],
    patterns: ['care of', 'c o', 'c/o', 'অভিভাবক', 'প্রযোজ্য'],
  },
  {
    profileKey: 'permanent_address.care_of',
    sectionAllowed: ['permanent_address'],
    patterns: ['care of', 'c o', 'c/o', 'অভিভাবক', 'প্রযোজ্য'],
  },
  {
    profileKey: 'present_address.village_town_road',
    sectionAllowed: ['present_address'],
    patterns: ['village town road', 'village road', 'flat road', 'village', 'road', 'গ্রাম রাস্তা', 'গ্রাম', 'মহল্লা'],
  },
  {
    profileKey: 'permanent_address.village_town_road',
    sectionAllowed: ['permanent_address'],
    patterns: ['village town road', 'village road', 'flat road', 'village', 'road', 'গ্রাম রাস্তা', 'গ্রাম', 'মহল্লা'],
  },
  {
    profileKey: 'present_address.post_office',
    sectionAllowed: ['present_address'],
    patterns: ['post office', 'post name', 'ডাকঘর', 'ডাক ঘর'],
  },
  {
    profileKey: 'permanent_address.post_office',
    sectionAllowed: ['permanent_address'],
    patterns: ['post office', 'post name', 'ডাকঘর', 'ডাক ঘর'],
  },
  {
    profileKey: 'present_address.postal_code',
    sectionAllowed: ['present_address'],
    patterns: ['postal code', 'post code', 'পোস্ট কোড', 'পোস্টকোড'],
  },
  {
    profileKey: 'permanent_address.postal_code',
    sectionAllowed: ['permanent_address'],
    patterns: ['postal code', 'post code', 'পোস্ট কোড', 'পোস্টকোড'],
  },
  {
    profileKey: 'present_address.district',
    sectionAllowed: ['present_address'],
    patterns: ['district', 'জেলা'],
  },
  {
    profileKey: 'permanent_address.district',
    sectionAllowed: ['permanent_address'],
    patterns: ['district', 'জেলা'],
  },
  {
    profileKey: 'present_address.upazila_thana',
    sectionAllowed: ['present_address'],
    patterns: ['upazila thana', 'upazila', 'thana', 'উপজেলা', 'থানা'],
  },
  {
    profileKey: 'permanent_address.upazila_thana',
    sectionAllowed: ['permanent_address'],
    patterns: ['upazila thana', 'upazila', 'thana', 'উপজেলা', 'থানা'],
  },

  // --- EDUCATION SECTIONS (SSC, HSC, Graduation, Masters) ---
  // SSC
  {
    profileKey: 'ssc.roll_no',
    sectionAllowed: ['ssc'],
    patterns: ['roll no', 'roll number', 'roll', 'রোল নম্বর', 'রোল'],
  },
  {
    profileKey: 'ssc.reg_no',
    sectionAllowed: ['ssc'],
    patterns: ['registration no', 'reg no', 'reg number', 'registration', 'রেজিস্ট্রেশন নম্বর', 'রেজিস্ট্রেশন'],
  },
  {
    profileKey: 'ssc.board',
    sectionAllowed: ['ssc'],
    patterns: ['board', 'education board', 'বোর্ড'],
  },
  {
    profileKey: 'ssc.group_major',
    sectionAllowed: ['ssc'],
    patterns: ['group', 'major', 'group major', 'subject', 'বিভাগ', 'গ্রুপ'],
  },
  {
    profileKey: 'ssc.passing_year',
    sectionAllowed: ['ssc'],
    patterns: ['passing year', 'pass year', 'year of passing', 'year', 'পাশের সন', 'পাশের বছর', 'সন'],
  },
  {
    profileKey: 'ssc.result_gpa',
    sectionAllowed: ['ssc'],
    patterns: ['result gpa', 'gpa', 'result', 'cgpa', 'ফলাফল', 'জিপিএ'],
  },

  // HSC
  {
    profileKey: 'hsc.roll_no',
    sectionAllowed: ['hsc'],
    patterns: ['roll no', 'roll number', 'roll', 'রোল নম্বর', 'রোল'],
  },
  {
    profileKey: 'hsc.reg_no',
    sectionAllowed: ['hsc'],
    patterns: ['registration no', 'reg no', 'reg number', 'registration', 'রেজিস্ট্রেশন নম্বর', 'রেজিস্ট্রেশন'],
  },
  {
    profileKey: 'hsc.board',
    sectionAllowed: ['hsc'],
    patterns: ['board', 'education board', 'বোর্ড'],
  },
  {
    profileKey: 'hsc.group_major',
    sectionAllowed: ['hsc'],
    patterns: ['group', 'major', 'group major', 'subject', 'বিভাগ', 'গ্রুপ'],
  },
  {
    profileKey: 'hsc.passing_year',
    sectionAllowed: ['hsc'],
    patterns: ['passing year', 'pass year', 'year of passing', 'year', 'পাশের সন', 'পাশের বছর', 'সন'],
  },
  {
    profileKey: 'hsc.result_gpa',
    sectionAllowed: ['hsc'],
    patterns: ['result gpa', 'gpa', 'result', 'cgpa', 'ফলাফল', 'জিপিএ'],
  },

  // Graduation
  {
    profileKey: 'graduation.subject_degree',
    sectionAllowed: ['graduation'],
    patterns: ['subject degree', 'subject', 'degree', 'degree name', 'major', 'বিষয়', 'ডিগ্রী'],
  },
  {
    profileKey: 'graduation.institute_university',
    sectionAllowed: ['graduation'],
    patterns: ['institute university', 'university', 'institute', 'college', 'বিশ্ববিদ্যালয়', 'প্রতিষ্ঠান'],
  },
  {
    profileKey: 'graduation.passing_year',
    sectionAllowed: ['graduation'],
    patterns: ['passing year', 'pass year', 'year of passing', 'year', 'পাশের সন', 'পাশের বছর', 'সন'],
  },
  {
    profileKey: 'graduation.result_cgpa',
    sectionAllowed: ['graduation'],
    patterns: ['result cgpa', 'cgpa', 'result', 'gpa', 'ফলাফল', 'সিজিপিএ'],
  },
  {
    profileKey: 'graduation.course_duration_years',
    sectionAllowed: ['graduation'],
    patterns: ['course duration', 'duration', 'course duration years', 'মেয়াদ'],
  },

  // Masters
  {
    profileKey: 'masters.subject_degree',
    sectionAllowed: ['masters'],
    patterns: ['subject degree', 'subject', 'degree', 'degree name', 'major', 'বিষয়', 'ডিগ্রী'],
  },
  {
    profileKey: 'masters.institute_university',
    sectionAllowed: ['masters'],
    patterns: ['institute university', 'university', 'institute', 'college', 'বিশ্ববিদ্যালয়', 'প্রতিষ্ঠান'],
  },
  {
    profileKey: 'masters.passing_year',
    sectionAllowed: ['masters'],
    patterns: ['passing year', 'pass year', 'year of passing', 'year', 'পাশের সন', 'পাশের বছর', 'সন'],
  },
  {
    profileKey: 'masters.result_cgpa',
    sectionAllowed: ['masters'],
    patterns: ['result cgpa', 'cgpa', 'result', 'gpa', 'ফলাফল', 'সিজিপিএ'],
  },
];

interface CandidateText {
  text: string;
  source: FieldMatchResult['source'];
  weight: number;
}

function extractCandidateTexts(element: HTMLInputElement | HTMLTextAreaElement): CandidateText[] {
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

  // 7. Adjacent table cell or preceding label span (Weight: 0.70)
  const td = element.closest('td');
  if (td) {
    const prevTd = td.previousElementSibling;
    if (prevTd && prevTd.textContent) {
      candidates.push({
        text: normalizeText(prevTd.textContent),
        source: 'adjacent_text',
        weight: 0.70,
      });
    }
  }

  return candidates;
}

/**
 * Matches an input or textarea element to a profile key.
 */
export function matchField(
  element: HTMLInputElement | HTMLTextAreaElement,
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

      for (const pattern of rule.patterns) {
        let textMatchQuality = 0;

        if (candidate.text === pattern) {
          textMatchQuality = 1.0;
        } else if (candidate.text.startsWith(pattern) || candidate.text.endsWith(pattern)) {
          textMatchQuality = 0.9;
        } else if (candidate.text.includes(pattern)) {
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
