import React from 'react';
import { JobExperience } from '../../../src/types/profile';

interface ExperienceSectionProps {
  experiences: JobExperience[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, field: keyof JobExperience, value: any) => void;
}

export function ExperienceSection({
  experiences,
  onAdd,
  onRemove,
  onChange,
}: ExperienceSectionProps) {
  return (
    <section id="sec-experience" className="form-card" data-testid="section-experience">
      <div className="card-header">
        <div className="card-header-left">
          <span className="sec-badge">SEC 08</span>
          <h3 className="card-title">
            JOB EXPERIENCE <span className="card-title-bn">// চাকুরীর বিবরণ</span>
          </h3>
        </div>
        <span className="card-telemetry-tag">PROFESSIONAL CHRONICLE</span>
      </div>

      <div className="card-body">
        {experiences.length === 0 ? (
          <div className="empty-state">
            <p className="font-mono text-xs text-mutedgray uppercase">
              // NO PROFESSIONAL RECORDS LOGGED. CLICK ADD RECORD BELOW.
            </p>
          </div>
        ) : (
          <div className="experience-list">
            {experiences.map((exp, index) => {
              const expNumberStr = String(index + 1).padStart(2, '0');
              return (
                <div
                  key={exp.id}
                  className="experience-item-card"
                  data-testid={`exp-row-${index}`}
                >
                  <div className="item-card-header">
                    <span className="item-badge">[EXP-{expNumberStr}] CHRONICLE RECORD</span>
                    <button
                      type="button"
                      className="btn-delete-row"
                      onClick={() => onRemove(exp.id)}
                      title="Remove this experience"
                      data-testid={`remove-exp-${exp.id}`}
                    >
                      ✕ Remove
                    </button>
                  </div>

                  <div style={{ padding: '20px' }}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor={`exp-${exp.id}-org`}>
                          Organization / Firm Name <span className="req-star">*</span>
                        </label>
                        <input
                          id={`exp-${exp.id}-org`}
                          type="text"
                          className="swiss-input"
                          placeholder="e.g. PEARSON SPECTER LITT / TECH CORP"
                          value={exp.organization}
                          onChange={(e) => onChange(exp.id, 'organization', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor={`exp-${exp.id}-desig`}>
                          Designation / Post <span className="req-star">*</span>
                        </label>
                        <input
                          id={`exp-${exp.id}-desig`}
                          type="text"
                          className="swiss-input"
                          placeholder="e.g. SENIOR LITIGATION ASSOCIATE"
                          value={exp.designation}
                          onChange={(e) => onChange(exp.id, 'designation', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor={`exp-${exp.id}-emptype`}>
                          Employed On / Service Nature <span className="req-star">*</span>
                        </label>
                        <select
                          id={`exp-${exp.id}-emptype`}
                          className="swiss-select mono"
                          value={exp.employmentType || ''}
                          onChange={(e) => onChange(exp.id, 'employmentType', e.target.value)}
                        >
                          <option value="">Select Employment Type</option>
                          <option value="Regular Basis Under Revenue Budget">Regular Basis Under Revenue Budget</option>
                          <option value="Ad-hoc Basis Under Revenue Budget">Ad-hoc Basis Under Revenue Budget</option>
                          <option value="Temporary Basis Under Revenue Budget">Temporary Basis Under Revenue Budget</option>
                          <option value="Work Charged Basis Under Revenue Budget">Work Charged Basis Under Revenue Budget</option>
                          <option value="Temporary Basis Under Development Project">Temporary Basis Under Development Project</option>
                          <option value="Work Charged Basis Under Development Project">Work Charged Basis Under Development Project</option>
                          <option value="Autonomous/Semi Autonomous Organization">Autonomous/Semi Autonomous Organization</option>
                          <option value="Private Organization">Private Organization</option>
                          <option value="Business/Self Employed">Business/Self Employed</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor={`exp-${exp.id}-start`}>
                          Service From (Start Date) <span className="req-star">*</span>
                        </label>
                        <input
                          id={`exp-${exp.id}-start`}
                          type="date"
                          className="swiss-input mono"
                          value={exp.startDate}
                          onChange={(e) => onChange(exp.id, 'startDate', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor={`exp-${exp.id}-end`}>
                          Service To (End Date)
                        </label>
                        <input
                          id={`exp-${exp.id}-end`}
                          type="date"
                          className="swiss-input mono"
                          disabled={exp.isCurrent}
                          value={exp.isCurrent ? '' : exp.endDate}
                          onChange={(e) => onChange(exp.id, 'endDate', e.target.value)}
                        />
                      </div>

                      <div className="form-group full-width" style={{ marginTop: '4px' }}>
                        <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={exp.isCurrent}
                            onChange={(e) => onChange(exp.id, 'isCurrent', e.target.checked)}
                          />
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                            Currently Serving at this institution
                          </span>
                        </label>
                      </div>

                      <div className="form-group full-width">
                        <label htmlFor={`exp-${exp.id}-resp`}>Key Responsibilities &amp; Docket</label>
                        <textarea
                          id={`exp-${exp.id}-resp`}
                          className="swiss-textarea"
                          rows={3}
                          placeholder="Summary of responsibilities, discovery drafting, case dockets, operations..."
                          value={exp.responsibilities}
                          onChange={(e) => onChange(exp.id, 'responsibilities', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--hairline)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--mutedgray)', textTransform: 'uppercase' }}>
            // ADDITIONAL CHRONOLOGY MAY BE ENTERED
          </span>
          <button
            type="button"
            className="btn-add-row"
            onClick={onAdd}
            data-testid="add-experience-btn"
          >
            <span className="plus">+</span> Add Experience
          </button>
        </div>
      </div>
    </section>
  );
}
