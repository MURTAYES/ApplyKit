import { describe, it, expect } from 'vitest';
import { getMappingForUrl } from '../../src/engine/siteResolver';
import { matchField } from '../../src/engine/matcher';

describe('Site Resolver Engine (MATCH-05, MATCH-06)', () => {
  it('resolves Teletalk mapping for matching government portal URLs', () => {
    const url1 = 'https://alljobs.teletalk.com.bd/jobs/application/101';
    const url2 = 'http://dgfp.teletalk.com.bd/application_form.php';
    const url3 = 'https://bpsc.teletalk.com.bd/apply';
    const nonMatchingUrl = 'https://jobs.example.com/apply';

    const map1 = getMappingForUrl(url1);
    const map2 = getMappingForUrl(url2);
    const map3 = getMappingForUrl(url3);
    const map4 = getMappingForUrl(nonMatchingUrl);

    expect(map1).not.toBeNull();
    expect(map1?.domain).toBe('teletalk.com.bd');

    expect(map2).not.toBeNull();
    expect(map3).not.toBeNull();
    expect(map4).toBeNull();
  });

  it('overrides heuristic matching when site mapping matches selector', () => {
    const input = document.createElement('input');
    input.id = 'p_name';

    const mapping = getMappingForUrl('https://alljobs.teletalk.com.bd/apply')!;
    expect(mapping).not.toBeNull();

    const result = matchField(input, mapping);
    expect(result).not.toBeNull();
    expect(result?.profileKey).toBe('basicInfo.nameEn');
    expect(result?.confidence).toBe(1.0);
    expect(result?.source).toBe('custom_mapping');
  });
});
