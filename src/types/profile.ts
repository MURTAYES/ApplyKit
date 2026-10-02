import { z } from 'zod';

export const BasicInfoSchema = z.object({
  nameEn: z.string().default(''),
  nameBn: z.string().default(''),
  fatherNameEn: z.string().default(''),
  fatherNameBn: z.string().default(''),
  motherNameEn: z.string().default(''),
  motherNameBn: z.string().default(''),
  dob: z.string().default(''),
  gender: z.string().default(''),
  nid: z.string().default(''),
  phone: z.string().default(''),
  email: z.string().default(''),
  bloodGroup: z.string().default(''),
  religion: z.string().default(''),
  maritalStatus: z.string().default(''),
  quota: z.string().default(''),
}).default({});

export const AddressSchema = z.object({
  careOf: z.string().default(''),
  village: z.string().default(''),
  district: z.string().default(''),
  upazila: z.string().default(''),
  postOffice: z.string().default(''),
  postCode: z.string().default(''),
}).default({});

export const SecondaryEducationSchema = z.object({
  exam: z.string().default(''),
  board: z.string().default(''),
  roll: z.string().default(''),
  resultType: z.string().default(''),
  gpa: z.string().default(''),
  group: z.string().default(''),
  passingYear: z.string().default(''),
}).default({});

export const HigherEducationSchema = z.object({
  exam: z.string().default(''),
  university: z.string().default(''),
  subject: z.string().default(''),
  resultType: z.string().default(''),
  cgpa: z.string().default(''),
  passingYear: z.string().default(''),
  courseDuration: z.string().default(''),
}).default({});

export const JobExperienceSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  organization: z.string().default(''),
  designation: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
  isCurrent: z.boolean().default(false),
  responsibilities: z.string().default(''),
});

export const OtherQualificationsSchema = z.object({
  computerTypingEn: z.string().default(''),
  computerTypingBn: z.string().default(''),
  drivingLicense: z.string().default(''),
  extraCurricular: z.string().default(''),
}).default({});

export const ProfileSchema = z.object({
  basicInfo: BasicInfoSchema,
  presentAddress: AddressSchema,
  permanentAddress: AddressSchema,
  ssc: SecondaryEducationSchema,
  hsc: SecondaryEducationSchema,
  graduation: HigherEducationSchema,
  masters: HigherEducationSchema,
  jobExperiences: z.array(JobExperienceSchema).default([]),
  otherQualifications: OtherQualificationsSchema,
}).default({});

export type BasicInfo = z.infer<typeof BasicInfoSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type SecondaryEducation = z.infer<typeof SecondaryEducationSchema>;
export type HigherEducation = z.infer<typeof HigherEducationSchema>;
export type JobExperience = z.infer<typeof JobExperienceSchema>;
export type OtherQualifications = z.infer<typeof OtherQualificationsSchema>;
export type Profile = z.infer<typeof ProfileSchema>;

export const defaultJobExperience: JobExperience = {
  id: 'exp-1',
  organization: '',
  designation: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  responsibilities: '',
};

export const defaultProfile: Profile = ProfileSchema.parse({});
