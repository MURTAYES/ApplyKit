import { DISTRICTS, type DictionaryEntry } from './districts';
import { BOARDS } from './boards';
import { RELIGIONS } from './religions';
import { GENDERS } from './genders';
import { RESULTS } from './results';
import { QUOTAS } from './quotas';
import { EXAMINATIONS } from './examinations';
import { GROUPS } from './groups';
import { SUBJECTS } from './subjects';
import { NATIONALITIES, MARITAL_STATUSES, DEPARTMENTAL_STATUSES, COURSE_DURATIONS, YES_NO_OPTIONS } from './general';
import { EMPLOYMENT_TYPES } from './employment';
import { normalizeText } from '../normalizer';

export {
  DISTRICTS,
  BOARDS,
  RELIGIONS,
  GENDERS,
  RESULTS,
  QUOTAS,
  EXAMINATIONS,
  GROUPS,
  SUBJECTS,
  NATIONALITIES,
  MARITAL_STATUSES,
  DEPARTMENTAL_STATUSES,
  COURSE_DURATIONS,
  YES_NO_OPTIONS,
  EMPLOYMENT_TYPES,
};
export type { DictionaryEntry };

const ALL_DICTIONARIES: Record<string, DictionaryEntry[]> = {
  district: DISTRICTS,
  board: BOARDS,
  religion: RELIGIONS,
  gender: GENDERS,
  result: RESULTS,
  quota: QUOTAS,
  examination: EXAMINATIONS,
  exam: EXAMINATIONS,
  group: GROUPS,
  subject: SUBJECTS,
  nationality: NATIONALITIES,
  maritalstatus: MARITAL_STATUSES,
  departmentalstatus: DEPARTMENTAL_STATUSES,
  courseduration: COURSE_DURATIONS,
  yesno: YES_NO_OPTIONS,
  employmenttype: EMPLOYMENT_TYPES,
  employedon: EMPLOYMENT_TYPES,
};

/**
 * Searches for all known aliases, canonical English, and Bengali names corresponding to a search term.
 * Can be scoped to a specific category (e.g. 'district', 'board', 'examination') or searched globally.
 */
export function lookupBilingualAliases(
  term: string,
  categoryHint?: string
): string[] {
  if (!term || term.trim() === '') return [];

  const normalized = normalizeText(term);
  const matchedAliases = new Set<string>();
  matchedAliases.add(normalized);

  const dictsToSearch: DictionaryEntry[][] = [];

  if (categoryHint && ALL_DICTIONARIES[categoryHint.toLowerCase()]) {
    dictsToSearch.push(ALL_DICTIONARIES[categoryHint.toLowerCase()]);
  } else {
    Object.values(ALL_DICTIONARIES).forEach((dict) => dictsToSearch.push(dict));
  }

  for (const dict of dictsToSearch) {
    for (const entry of dict) {
      const entryMatches =
        normalizeText(entry.canonicalEn) === normalized ||
        normalizeText(entry.canonicalBn) === normalized ||
        entry.aliases.some((alias) => normalizeText(alias) === normalized);

      if (entryMatches) {
        matchedAliases.add(normalizeText(entry.canonicalEn));
        matchedAliases.add(normalizeText(entry.canonicalBn));
        entry.aliases.forEach((a) => matchedAliases.add(normalizeText(a)));
      }
    }
  }

  return Array.from(matchedAliases);
}
