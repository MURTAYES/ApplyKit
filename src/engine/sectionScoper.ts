import { SectionScope } from '../types/mapping';
import { normalizeText } from './normalizer';

const SECTION_KEYWORDS: Array<{ scope: SectionScope; keywords: string[] }> = [
  {
    scope: 'ssc',
    keywords: [
      'ssc',
      's s c',
      'dakhil',
      'secondary school certificate',
      'secondary',
      'এসএসসি',
      'দাখিল',
      'মাধ্যমিক',
    ],
  },
  {
    scope: 'hsc',
    keywords: [
      'hsc',
      'h s c',
      'alim',
      'higher secondary certificate',
      'higher secondary',
      'এইচএসসি',
      'আলিম',
      'উচ্চ মাধ্যমিক',
    ],
  },
  {
    scope: 'masters',
    keywords: [
      'masters',
      'post graduation',
      'post graduate',
      'msc',
      'mba',
      'ma',
      'mss',
      'মাস্টার্স',
      'স্নাতকোত্তর',
    ],
  },
  {
    scope: 'graduation',
    keywords: [
      'graduation',
      'graduate',
      'bachelor',
      'degree',
      'honours',
      'honors',
      'bsc',
      'bba',
      'ba',
      'bss',
      'স্নাতক',
      'অনার্স',
    ],
  },
  {
    scope: 'permanent_address',
    keywords: [
      'permanent address',
      'permanent',
      'স্থায়ী ঠিকানা',
      'স্থায়ী',
    ],
  },
  {
    scope: 'present_address',
    keywords: [
      'present address',
      'present',
      'mailing address',
      'communication address',
      'contact address',
      'বর্তমান ঠিকানা',
      'যোগাযোগের ঠিকানা',
    ],
  },
  {
    scope: 'job_experience',
    keywords: [
      'job experience',
      'employment history',
      'work experience',
      'experience',
      'চাকরির অভিজ্ঞতা',
      'অভিজ্ঞতা',
      'কর্মসংস্থান',
    ],
  },
  {
    scope: 'other_qualifications',
    keywords: [
      'other qualification',
      'additional qualification',
      'extra qualification',
      'computer typing',
      'অন্যান্য যোগ্যতা',
      'অতিরিক্ত যোগ্যতা',
    ],
  },
  {
    scope: 'basic_info',
    keywords: [
      'basic information',
      'personal information',
      'personal details',
      'applicant information',
      'general information',
      'সাধারণ তথ্য',
      'ব্যক্তিগত তথ্য',
      'প্রার্থীর তথ্য',
    ],
  },
];

function matchScopeFromText(text: string): SectionScope | null {
  const norm = normalizeText(text);
  if (!norm) return null;

  for (const entry of SECTION_KEYWORDS) {
    for (const kw of entry.keywords) {
      // Use word boundary check
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|\\s)${escaped}(\\s|$)`, 'i');
      if (regex.test(norm)) {
        return entry.scope;
      }
    }
  }
  return null;
}

/**
 * Traverses DOM upward and sideways to determine the section scope of a given input element.
 */
export function detectSectionScope(element: HTMLElement): SectionScope {
  // 1. Check enclosing fieldset legend or data attributes going upward
  let curr: HTMLElement | null = element;
  while (curr && curr !== document.body && curr !== document.documentElement) {
    const dataSection = curr.getAttribute('data-section') || curr.getAttribute('data-scope');
    if (dataSection) {
      const scope = matchScopeFromText(dataSection);
      if (scope) return scope;
    }

    if (curr.tagName === 'FIELDSET') {
      const legend = curr.querySelector('legend');
      if (legend && legend.textContent) {
        const scope = matchScopeFromText(legend.textContent);
        if (scope) return scope;
      }
    }

    if (curr.tagName === 'TABLE') {
      const caption = curr.querySelector('caption');
      if (caption && caption.textContent) {
        const scope = matchScopeFromText(caption.textContent);
        if (scope) return scope;
      }
      const thead = curr.querySelector('thead');
      if (thead && thead.textContent) {
        const scope = matchScopeFromText(thead.textContent);
        if (scope) return scope;
      }
    }

    // Check previous siblings at this hierarchy level for headings or legends
    let prev = curr.previousElementSibling;
    while (prev) {
      if (/^H[1-6]$/.test(prev.tagName) || prev.classList.contains('section-header') || prev.classList.contains('section-title') || prev.tagName === 'LEGEND') {
        const scope = matchScopeFromText(prev.textContent || '');
        if (scope) return scope;
      }
      const innerHeading = prev.querySelector('h1, h2, h3, h4, h5, h6, .section-header, .section-title, legend');
      if (innerHeading && innerHeading.textContent) {
        const scope = matchScopeFromText(innerHeading.textContent);
        if (scope) return scope;
      }
      prev = prev.previousElementSibling;
    }

    curr = curr.parentElement;
  }

  // 2. Global preceding headings traversal in document tree order
  const allHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, legend, .section-header, .section-title'));
  let nearestPrecedingHeading: Element | null = null;

  for (const h of allHeadings) {
    // If heading precedes element in DOM (DOCUMENT_POSITION_PRECEDING = 2 or contains = 16)
    const pos = element.compareDocumentPosition(h);
    if (pos & Node.DOCUMENT_POSITION_PRECEDING) {
      nearestPrecedingHeading = h;
    }
  }

  if (nearestPrecedingHeading && nearestPrecedingHeading.textContent) {
    const scope = matchScopeFromText(nearestPrecedingHeading.textContent);
    if (scope) return scope;
  }

  return 'basic_info';
}
