import React from 'react';
import { OtherQualifications } from '../../../src/types/profile';

interface QualificationsSectionProps {
  data: OtherQualifications;
  onChange: (field: keyof OtherQualifications, value: string) => void;
}

export function QualificationsSection({
  data,
  onChange,
}: QualificationsSectionProps) {
  return (
    <section id="sec-qualifications" className="form-card" data-testid="section-qualifications">
      <div className="card-header">
        <div className="card-header-left">
          <span className="sec-badge">SEC 09</span>
          <h3 className="card-title">
            OTHER QUALIFICATIONS <span className="card-title-bn">// অন্যান্য যোগ্যতা ও সনদ</span>
          </h3>
        </div>
        <span className="card-telemetry-tag">AUXILIARY COMPETENCE</span>
      </div>

      <div className="card-body">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="computerTypingEn">Computer Typing Speed (English)</label>
            <input
              id="computerTypingEn"
              type="text"
              className="swiss-input mono"
              placeholder="e.g. 35 WPM"
              value={data.computerTypingEn}
              onChange={(e) => onChange('computerTypingEn', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="computerTypingBn">Computer Typing Speed (Bangla)</label>
            <input
              id="computerTypingBn"
              type="text"
              className="swiss-input mono"
              placeholder="e.g. 30 WPM"
              value={data.computerTypingBn}
              onChange={(e) => onChange('computerTypingBn', e.target.value)}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="drivingLicense">Driving License Number</label>
            <input
              id="drivingLicense"
              type="text"
              className="swiss-input mono"
              placeholder="e.g. DL-12345678"
              value={data.drivingLicense}
              onChange={(e) => onChange('drivingLicense', e.target.value)}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="extraCurricular">Extra-Curricular Activities &amp; Skills</label>
            <textarea
              id="extraCurricular"
              className="swiss-textarea"
              rows={3}
              placeholder="e.g. Debating Championship, Bar Association Volunteer, Advanced MS Office..."
              value={data.extraCurricular}
              onChange={(e) => onChange('extraCurricular', e.target.value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
