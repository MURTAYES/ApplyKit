import { describe, it, expect } from 'vitest';
import { ProfileSchema, defaultProfile } from '../src/types/profile';

describe('ProfileSchema', () => {
  it('should parse an empty object and produce default profile structure', () => {
    const result = ProfileSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.basicInfo.nameEn).toBe('');
      expect(result.data.basicInfo.nameBn).toBe('');
      expect(result.data.presentAddress.district).toBe('');
      expect(result.data.permanentAddress.district).toBe('');
      expect(result.data.ssc.exam).toBe('');
      expect(result.data.hsc.exam).toBe('');
      expect(result.data.graduation.cgpa).toBe('');
      expect(result.data.masters.university).toBe('');
      expect(result.data.jobExperiences).toEqual([]);
      expect(result.data.otherQualifications.computerTypingEn).toBe('');
    }
  });

  it('should support separate English and Bangla name fields (D-11, PROF-05)', () => {
    const customData = {
      basicInfo: {
        nameEn: 'Md. Abdur Rahman',
        nameBn: 'মোঃ আব্দুর রহমান',
        fatherNameEn: 'Abdul Karim',
        fatherNameBn: 'আব্দুল করিম',
      },
    };
    const parsed = ProfileSchema.parse(customData);
    expect(parsed.basicInfo.nameEn).toBe('Md. Abdur Rahman');
    expect(parsed.basicInfo.nameBn).toBe('মোঃ আব্দুর রহমান');
    expect(parsed.basicInfo.fatherNameEn).toBe('Abdul Karim');
    expect(parsed.basicInfo.fatherNameBn).toBe('আব্দুল করিম');
  });

  it('should allow partial nested inputs without throwing errors (PROF-04)', () => {
    const partial = {
      ssc: {
        roll: '123456',
        gpa: '5.00',
      },
      jobExperiences: [
        {
          id: 'exp-1',
          organization: 'Bangladesh IT Ltd',
          designation: 'Software Engineer',
        },
      ],
    };

    const parsed = ProfileSchema.parse(partial);
    expect(parsed.ssc.roll).toBe('123456');
    expect(parsed.ssc.gpa).toBe('5.00');
    expect(parsed.ssc.board).toBe(''); // default
    expect(parsed.jobExperiences.length).toBe(1);
    expect(parsed.jobExperiences[0].organization).toBe('Bangladesh IT Ltd');
    expect(parsed.jobExperiences[0].isCurrent).toBe(false);
  });
});
