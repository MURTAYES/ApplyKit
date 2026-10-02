import { normalizeText } from './normalizer';
import { lookupBilingualAliases } from './dictionaries';

export interface OptionMatchResult {
  option: HTMLOptionElement;
  index: number;
  confidence: number;
  matchedText: string;
}

const PLACEHOLDER_PATTERNS = [
  /^--+.*--+$/,
  /^select/i,
  /^choose/i,
  /^please\s*select/i,
  /^pick/i,
  /^none/i,
  /^নির্বাচন/i,
  /^বাছাই/i,
  /^--\s*select\s*--$/i,
];

/**
 * Determines whether a given <option> is an unselected placeholder/prompt rather than a real data choice.
 */
export function isPlaceholderOption(option: HTMLOptionElement): boolean {
  const val = (option.value || '').trim();
  const text = (option.text || '').trim();

  if (val === '' || val === '0' || val === '-1' || val === 'null' || val === 'undefined') {
    return true;
  }

  const normalized = normalizeText(text);
  if (normalized === '' || normalized === '--') {
    return true;
  }

  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(normalized));
}

/**
 * Finds the best matching <option> in a <select> element for a desired target value.
 * Uses normalized text comparison, bilingual dictionary expansion, and confidence scoring.
 */
export function findBestOptionMatch(
  selectEl: HTMLSelectElement,
  targetValue: string,
  categoryHint?: string
): OptionMatchResult | null {
  if (!selectEl || !targetValue || targetValue.trim() === '') {
    return null;
  }

  const normalizedTarget = normalizeText(targetValue);
  const targetAliases = lookupBilingualAliases(targetValue, categoryHint);

  const options = Array.from(selectEl.options);
  let bestMatch: OptionMatchResult | null = null;
  let highestConfidence = 0;

  for (let i = 0; i < options.length; i++) {
    const opt = options[i];

    // Skip unselectable/placeholder items
    if (isPlaceholderOption(opt)) {
      continue;
    }

    const optText = normalizeText(opt.text || '');
    const optVal = normalizeText(opt.value || '');

    let score = 0;

    // 1. Direct exact match against target or any bilingual alias
    for (const alias of targetAliases) {
      if (optText === alias || optVal === alias) {
        score = 1.0;
        break;
      }
    }

    // 2. Token overlap & substring matching if no exact match
    if (score < 1.0) {
      for (const alias of targetAliases) {
        if (optText.startsWith(alias) || alias.startsWith(optText)) {
          const ratio = Math.min(optText.length, alias.length) / Math.max(optText.length, alias.length);
          score = Math.max(score, 0.85 * ratio + 0.1);
        } else if (optText.includes(alias) || alias.includes(optText)) {
          const ratio = Math.min(optText.length, alias.length) / Math.max(optText.length, alias.length);
          score = Math.max(score, 0.80 * ratio);
        }
      }
    }

    if (score > highestConfidence) {
      highestConfidence = score;
      bestMatch = {
        option: opt,
        index: i,
        confidence: score,
        matchedText: opt.text,
      };
    }
  }

  // Strict confidence threshold (DROP-04)
  if (bestMatch && bestMatch.confidence >= 0.75) {
    return bestMatch;
  }

  return null;
}
