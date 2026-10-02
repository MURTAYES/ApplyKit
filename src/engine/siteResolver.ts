import { SiteMapping } from '../types/mapping';
import teletalkJson from '../mappings/teletalk.json';

const REGISTERED_SITE_MAPPINGS: Array<{
  mapping: SiteMapping;
  patterns: RegExp[];
}> = [
  {
    mapping: teletalkJson as unknown as SiteMapping,
    patterns: (teletalkJson.urlPatterns || []).map((p: string) => new RegExp(p, 'i')),
  },
];

/**
 * Resolves the appropriate site-specific mapping based on page URL.
 * Returns SiteMapping if a pattern matches, otherwise null.
 */
export function getMappingForUrl(url: string): SiteMapping | null {
  if (!url) return null;

  for (const entry of REGISTERED_SITE_MAPPINGS) {
    for (const pattern of entry.patterns) {
      if (pattern.test(url)) {
        return entry.mapping;
      }
    }
  }

  // Fallback domain substring check (e.g. teletalk.com.bd)
  if (url.includes('teletalk.com.bd')) {
    return teletalkJson as unknown as SiteMapping;
  }

  return null;
}
