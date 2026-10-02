const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const ASCII_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * Normalizes text for comparison and matching:
 * - Unicode NFC normalization
 * - Strips zero-width characters (ZWJ, ZWNJ, BOM)
 * - Converts to lower case
 * - Strips non-alphanumeric punctuation (while preserving Bengali characters)
 * - Collapses multiple spaces into single spaces
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // remove zero-width chars
    .toLowerCase()
    .replace(/['"’‘`]/g, '') // remove apostrophes and quotes
    .replace(/[:\-–—_/\\.,()#*]/g, ' ') // replace common separators with space
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Transliterates Bengali digits (০-৯) to ASCII digits (0-9).
 */
export function bengaliToAsciiDigits(str: string): string {
  if (!str) return '';
  let result = str.normalize('NFC').replace(/[\u200B-\u200D\uFEFF]/g, '');
  for (let i = 0; i < 10; i++) {
    result = result.replaceAll(BENGALI_DIGITS[i], ASCII_DIGITS[i]);
  }
  return result;
}

/**
 * Transliterates ASCII digits (0-9) to Bengali digits (০-৯).
 */
export function asciiToBengaliDigits(str: string): string {
  if (!str) return '';
  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result.replaceAll(ASCII_DIGITS[i], BENGALI_DIGITS[i]);
  }
  return result;
}

/**
 * Normalizes a date string into target format:
 * default output: YYYY-MM-DD
 * Supports input in YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY, or Bengali digit dates.
 */
export function normalizeDateValue(
  dateStr: string,
  targetFormat: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'DD-MM-YYYY' | 'MM/DD/YYYY' | 'MM-DD-YYYY' = 'YYYY-MM-DD'
): string {
  if (!dateStr) return '';
  const asciiDate = bengaliToAsciiDigits(dateStr).trim();

  let year = '';
  let month = '';
  let day = '';

  // Match YYYY-MM-DD or YYYY/MM/DD
  const isoMatch = asciiDate.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (isoMatch) {
    year = isoMatch[1];
    month = isoMatch[2].padStart(2, '0');
    day = isoMatch[3].padStart(2, '0');
  } else {
    // Match DD/MM/YYYY or DD-MM-YYYY
    const dmyMatch = asciiDate.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
    if (dmyMatch) {
      day = dmyMatch[1].padStart(2, '0');
      month = dmyMatch[2].padStart(2, '0');
      year = dmyMatch[3];
    }
  }

  if (!year || !month || !day) {
    return dateStr;
  }

  if (targetFormat === 'DD/MM/YYYY') {
    return `${day}/${month}/${year}`;
  }
  if (targetFormat === 'DD-MM-YYYY') {
    return `${day}-${month}-${year}`;
  }
  if (targetFormat === 'MM/DD/YYYY') {
    return `${month}/${day}/${year}`;
  }
  if (targetFormat === 'MM-DD-YYYY') {
    return `${month}-${day}-${year}`;
  }
  return `${year}-${month}-${day}`;
}
