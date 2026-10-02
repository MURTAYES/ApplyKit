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
        <div className="card-header-icon">⭐</div>
        <div>
          <h3 className="card-title">Other Qualifications</h3>
          <p className="card-description">Typing speed, licenses, and extra skills</p>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="computerTypingEn">Computer Typing Speed (English)</label>
          <input
            id="computerTypingEn"
            type="text"
            className="form-input"
            placeholder="e.g. 30 WPM"
            value={data.computerTypingEn}
            onChange={(e) => onChange('computerTypingEn', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="computerTypingBn">Computer Typing Speed (Bangla)</label>
          <input
            id="computerTypingBn"
            type="text"
            className="form-input"
            placeholder="e.g. 25 WPM"
            value={data.computerTypingBn}
            onChange={(e) => onChange('computerTypingBn', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="drivingLicense">Driving License Number</label>
          <input
            id="drivingLicense"
            type="text"
            className="form-input"
            placeholder="e.g. DL12345678"
            value={data.drivingLicense}
            onChange={(e) => onChange('drivingLicense', e.target.value)}
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="extraCurricular">Extra-Curricular Activities / Other Skills</label>
          <textarea
            id="extraCurricular"
            className="form-textarea"
            rows={3}
            placeholder="e.g. Debating Club, Red Crescent Volunteer, MS Office Certified..."
            value={data.extraCurricular}
            onChange={(e) => onChange('extraCurricular', e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
