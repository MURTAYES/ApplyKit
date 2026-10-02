import { DictionaryEntry } from './districts';

export const NATIONALITIES: DictionaryEntry[] = [
  {
    canonicalEn: 'Bangladeshi',
    canonicalBn: 'বাংলাদেশী',
    aliases: ['bangladeshi', 'bangladesh', 'বাংলাদেশী', 'বাংলাদেশি', 'বাংলাদেশ'],
  },
];

export const MARITAL_STATUSES: DictionaryEntry[] = [
  {
    canonicalEn: 'Single',
    canonicalBn: 'অবিবাহিত',
    aliases: ['single', 'unmarried', 'অবিবাহিত'],
  },
  {
    canonicalEn: 'Married',
    canonicalBn: 'বিবাহিত',
    aliases: ['married', 'বিবাহিত'],
  },
  {
    canonicalEn: 'Divorced',
    canonicalBn: 'তালাকপ্রাপ্ত',
    aliases: ['divorced', 'তালাকপ্রাপ্ত', 'ডিভোর্সড'],
  },
  {
    canonicalEn: 'Widowed',
    canonicalBn: 'বিধবা/বিপত্নীক',
    aliases: ['widowed', 'widow', 'widower', 'বিধবা', 'বিপত্নীক', 'বিধবা/বিপত্নীক'],
  },
];

export const DEPARTMENTAL_STATUSES: DictionaryEntry[] = [
  {
    canonicalEn: 'None',
    canonicalBn: 'কোনোটিই নয়',
    aliases: ['none', 'not applicable', 'na', 'regular', 'none/regular', 'কোনোটিই নয়', 'কোনটিই নয়', 'সাধারণ', 'প্রযোজ্য নয়'],
  },
  {
    canonicalEn: 'Govt. Employee',
    canonicalBn: 'সরকারি কর্মচারী',
    aliases: ['govt employee', 'govt. employee', 'government employee', 'সরকারি কর্মচারী', 'সরকারি চাকরিজীবী'],
  },
  {
    canonicalEn: 'Semi Govt. Employee',
    canonicalBn: 'আধাসরকারি কর্মচারী',
    aliases: ['semi govt', 'semi-govt', 'semi govt. employee', 'আধাসরকারি কর্মচারী'],
  },
  {
    canonicalEn: 'Autonomous',
    canonicalBn: 'স্বায়ত্তশাসিত',
    aliases: ['autonomous', 'স্বায়ত্তশাসিত'],
  },
  {
    canonicalEn: 'Departmental Candidate',
    canonicalBn: 'বিভাগীয় প্রার্থী',
    aliases: ['departmental candidate', 'departmental', 'বিভাগীয় প্রার্থী'],
  },
];

export const COURSE_DURATIONS: DictionaryEntry[] = [
  { canonicalEn: '1 Year', canonicalBn: '১ বছর', aliases: ['1 year', '1', '১ বছর', '১', '1 years'] },
  { canonicalEn: '2 Years', canonicalBn: '২ বছর', aliases: ['2 years', '2', '২ বছর', '২', '2 year'] },
  { canonicalEn: '3 Years', canonicalBn: '৩ বছর', aliases: ['3 years', '3', '৩ বছর', '৩', '3 year'] },
  { canonicalEn: '4 Years', canonicalBn: '৪ বছর', aliases: ['4 years', '4', '৪ বছর', '৪', '4 year'] },
  { canonicalEn: '5 Years', canonicalBn: '৫ বছর', aliases: ['5 years', '5', '৫ বছর', '৫', '5 year'] },
];

export const YES_NO_OPTIONS: DictionaryEntry[] = [
  {
    canonicalEn: 'Yes',
    canonicalBn: 'হ্যাঁ',
    aliases: ['yes', 'y', '1', 'true', 'হ্যাঁ', 'হ্যা'],
  },
  {
    canonicalEn: 'No',
    canonicalBn: 'না',
    aliases: ['no', 'n', '0', 'false', 'না'],
  },
];
