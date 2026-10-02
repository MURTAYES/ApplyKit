import { describe, it, expect } from 'vitest';
import { lookupBilingualAliases, DISTRICTS, BOARDS, RELIGIONS, GENDERS } from '../../src/engine/dictionaries';

describe('Bilingual Dictionaries', () => {
  it('contains all 64 districts in Bangladesh', () => {
    expect(DISTRICTS.length).toBe(64);
  });

  it('maps English district to Bangla Unicode name', () => {
    const aliases = lookupBilingualAliases('Dhaka', 'district');
    expect(aliases).toContain('dhaka');
    expect(aliases).toContain('ঢাকা');
  });

  it('maps Bangla district to English name', () => {
    const aliases = lookupBilingualAliases('চট্টগ্রাম', 'district');
    expect(aliases).toContain('chattogram');
    expect(aliases).toContain('chittagong');
  });

  it('maps Education Boards bilingual aliases', () => {
    const aliases = lookupBilingualAliases('Comilla', 'board');
    expect(aliases).toContain('cumilla');
    expect(aliases).toContain('কুমিল্লা');
  });

  it('maps Madrasah and Technical boards', () => {
    const madrasah = lookupBilingualAliases('মাদ্রাসা', 'board');
    expect(madrasah).toContain('madrasah');

    const technical = lookupBilingualAliases('Technical', 'board');
    expect(technical).toContain('কারিগরি');
  });

  it('maps Religions and Genders', () => {
    const islam = lookupBilingualAliases('Islam', 'religion');
    expect(islam).toContain('ইসলাম');

    const male = lookupBilingualAliases('Male', 'gender');
    expect(male).toContain('পুরুষ');

    const female = lookupBilingualAliases('মহিলা', 'gender');
    expect(female).toContain('female');
  });

  it('handles empty or unrecognized input safely', () => {
    expect(lookupBilingualAliases('')).toEqual([]);
    expect(lookupBilingualAliases('UnknownCity123', 'district')).toEqual(['unknowncity123']);
  });
});
