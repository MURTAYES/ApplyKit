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
      <div className="card-header section-header-split">
        <div className="card-header-left">
          <div className="card-header-icon">💼</div>
          <div>
            <h3 className="card-title">Job Experiences</h3>
            <p className="card-description">Employment history and work records</p>
          </div>
        </div>

        <button
          type="button"
          className="btn-secondary btn-icon-text"
          onClick={onAdd}
          data-testid="add-experience-btn"
        >
          <span>➕</span> Add Experience
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="empty-state">
          <p>No job experiences added. Click "Add Experience" to add employment records.</p>
        </div>
      ) : (
        <div className="experience-list">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="experience-item-card" data-testid={`exp-row-${index}`}>
              <div className="item-card-header">
                <span className="item-badge">Experience #{index + 1}</span>
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

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor={`exp-${exp.id}-org`}>Organization / Company Name</label>
                  <input
                    id={`exp-${exp.id}-org`}
                    type="text"
                    className="form-input"
                    placeholder="e.g. Bangladesh Ltd"
                    value={exp.organization}
                    onChange={(e) => onChange(exp.id, 'organization', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`exp-${exp.id}-desig`}>Designation / Post</label>
                  <input
                    id={`exp-${exp.id}-desig`}
                    type="text"
                    className="form-input"
                    placeholder="e.g. Senior Officer"
                    value={exp.designation}
                    onChange={(e) => onChange(exp.id, 'designation', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`exp-${exp.id}-start`}>Start Date</label>
                  <input
                    id={`exp-${exp.id}-start`}
                    type="date"
                    className="form-input"
                    value={exp.startDate}
                    onChange={(e) => onChange(exp.id, 'startDate', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`exp-${exp.id}-end`}>End Date</label>
                  <input
                    id={`exp-${exp.id}-end`}
                    type="date"
                    className="form-input"
                    disabled={exp.isCurrent}
                    value={exp.isCurrent ? '' : exp.endDate}
                    onChange={(e) => onChange(exp.id, 'endDate', e.target.value)}
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={exp.isCurrent}
                      onChange={(e) => onChange(exp.id, 'isCurrent', e.target.checked)}
                    />
                    <span>Currently working here</span>
                  </label>
                </div>

                <div className="form-group full-width">
                  <label htmlFor={`exp-${exp.id}-resp`}>Key Responsibilities</label>
                  <textarea
                    id={`exp-${exp.id}-resp`}
                    className="form-textarea"
                    rows={2}
                    placeholder="Brief summary of duties..."
                    value={exp.responsibilities}
                    onChange={(e) => onChange(exp.id, 'responsibilities', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
