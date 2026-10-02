export type SectionScope =
  | 'basic_info'
  | 'present_address'
  | 'permanent_address'
  | 'ssc'
  | 'hsc'
  | 'graduation'
  | 'masters'
  | 'job_experience'
  | 'other_qualifications'
  | 'unknown';

export interface FieldMatchResult {
  profileKey: string;
  confidence: number;
  source: 'custom_mapping' | 'label_for' | 'enclosing_label' | 'aria_label' | 'placeholder' | 'name_or_id' | 'adjacent_text';
  section: SectionScope;
}

export interface SiteMapping {
  domain: string;
  fields: Record<string, {
    selector: string;
    profileKey: string;
    section?: SectionScope;
  }>;
}
