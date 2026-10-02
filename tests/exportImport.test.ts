import { describe, it, expect, vi } from 'vitest';
import { exportProfileToJson, importProfileFromJson } from '../src/utils/exportImport';
import { defaultProfile, ProfileSchema } from '../src/types/profile';

describe('exportImport utilities', () => {
  it('should successfully import valid profile JSON string', () => {
    const validJson = JSON.stringify({
      basicInfo: {
        nameEn: 'Tariq Rahman',
        nid: '19901234567890123',
      },
      presentAddress: {
        district: 'Dhaka',
      },
    });

    const result = importProfileFromJson(validJson);
    expect(result.success).toBe(true);
    expect(result.data?.basicInfo.nameEn).toBe('Tariq Rahman');
    expect(result.data?.basicInfo.nid).toBe('19901234567890123');
    expect(result.data?.presentAddress.district).toBe('Dhaka');
    expect(result.data?.basicInfo.fatherNameEn).toBe(''); // default filled
  });

  it('should return error for invalid JSON syntax', () => {
    const invalidJson = '{ name: corrupted json without quotes ';
    const result = importProfileFromJson(invalidJson);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Syntax error');
  });

  it('should return error for non-object JSON values', () => {
    const primitiveJson = '12345';
    const result = importProfileFromJson(primitiveJson);
    expect(result.success).toBe(false);
    expect(result.error).toContain('must be an object');
  });

  it('should trigger download link in exportProfileToJson', () => {
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    exportProfileToJson(defaultProfile);

    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
  });
});
