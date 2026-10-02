import { describe, it, expect } from 'vitest';
import {
  normalizeText,
  bengaliToAsciiDigits,
  asciiToBengaliDigits,
  normalizeDateValue,
} from '../../src/engine/normalizer';

describe('normalizer', () => {
  it('normalizes text with NFC, strips punctuation, lowercase and trims', () => {
    expect(normalizeText('  Applicant’s Name:  ')).toBe('applicant’s name');
    expect(normalizeText('প্রার্থীর নাম : ')).toBe('প্রার্থীর নাম');
    expect(normalizeText('ROLL_NO')).toBe('roll no');
    expect(normalizeText('Date - of - Birth')).toBe('date of birth');
  });

  it('strips zero-width characters (ZWJ, ZWNJ, BOM)', () => {
    const textWithZWNJ = 'বাংলা\u200Cনাম';
    expect(normalizeText(textWithZWNJ)).toBe('বাংলানাম');
  });

  it('converts Bengali digits to ASCII digits', () => {
    expect(bengaliToAsciiDigits('০১৭১২৩৪৫৬৭৮')).toBe('01712345678');
    expect(bengaliToAsciiDigits('১২৩৪৫৬৭৮৯০')).toBe('1234567890');
    expect(bengaliToAsciiDigits('Roll: ১২৩৪')).toBe('Roll: 1234');
  });

  it('converts ASCII digits to Bengali digits', () => {
    expect(asciiToBengaliDigits('01712345678')).toBe('০১৭১২৩৪৫৬৭৮');
    expect(asciiToBengaliDigits('1234567890')).toBe('১২৩৪৫৬৭৮৯০');
  });

  it('normalizes date strings across formats', () => {
    expect(normalizeDateValue('1995-08-15')).toBe('1995-08-15');
    expect(normalizeDateValue('15/08/1995')).toBe('1995-08-15');
    expect(normalizeDateValue('১৫/০৮/১৯৯৫')).toBe('1995-08-15');
    expect(normalizeDateValue('1995-08-15', 'DD/MM/YYYY')).toBe('15/08/1995');
    expect(normalizeDateValue('15-08-1995', 'DD/MM/YYYY')).toBe('15/08/1995');
  });
});
