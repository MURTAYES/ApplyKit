import { describe, it, expect, beforeEach } from 'vitest';
import { loadProfile, saveProfile, clearProfile, PROFILE_STORAGE_KEY } from '../src/storage/profileStorage';
import { ProfileSchema, defaultProfile } from '../src/types/profile';

describe('profileStorage', () => {
  beforeEach(async () => {
    await clearProfile();
  });

  it('should return defaultProfile when storage is empty', async () => {
    const profile = await loadProfile();
    expect(profile).toEqual(defaultProfile);
  });

  it('should save and retrieve profile correctly', async () => {
    const custom = ProfileSchema.parse({
      basicInfo: {
        nameEn: 'Fatima Begum',
        phone: '01711000000',
      },
    });

    const saved = await saveProfile(custom);
    expect(saved).toBe(true);

    const loaded = await loadProfile();
    expect(loaded.basicInfo.nameEn).toBe('Fatima Begum');
    expect(loaded.basicInfo.phone).toBe('01711000000');
  });

  it('should clear stored profile on clearProfile call', async () => {
    const custom = ProfileSchema.parse({
      basicInfo: { nameEn: 'Test User' },
    });
    await saveProfile(custom);

    const cleared = await clearProfile();
    expect(cleared).toBe(true);

    const afterClear = await loadProfile();
    expect(afterClear.basicInfo.nameEn).toBe('');
  });
});
