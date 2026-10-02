import React from 'react';
import { SecondaryEducation, HigherEducation } from '../../../src/types/profile';

interface SecondaryEducationProps {
  id: string;
  secCode: string;
  tierTag: string;
  title: string;
  titleBn: string;
  telemetryTag: string;
  data: SecondaryEducation;
  onChange: (field: keyof SecondaryEducation, value: string) => void;
}

export function SecondaryEducationCard({
  id,
  secCode,
  tierTag,
  title,
  titleBn,
  telemetryTag,
  data,
  onChange,
}: SecondaryEducationProps) {
  return (
    <section id={id} className="form-card" data-testid={`section-${id}`}>
      <div className="card-header">
        <div className="card-header-left">
          <span className="sec-badge">{secCode}</span>
          <h3 className="card-title">
            {tierTag} {title} <span className="card-title-bn">// {titleBn}</span>
          </h3>
        </div>
        <span className="card-telemetry-tag">{telemetryTag}</span>
      </div>

      <div className="card-body">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor={`${id}-exam`}>
              Examination / Degree <span className="req-star">*</span>
            </label>
            <select
              id={`${id}-exam`}
              className="swiss-select mono"
              value={data.exam}
              onChange={(e) => onChange('exam', e.target.value)}
            >
              <option value="">Select Examination</option>
              <option value="S.S.C">S.S.C</option>
              <option value="Dakhil">Dakhil</option>
              <option value="S.S.C Vocational">S.S.C Vocational</option>
              <option value="H.S.C">H.S.C</option>
              <option value="Alim">Alim</option>
              <option value="H.S.C Vocational">H.S.C Vocational</option>
              <option value="Diploma in Engineering">Diploma in Engineering</option>
              <option value="Equivalent">Equivalent / Others</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor={`${id}-board`}>
              Board <span className="req-star">*</span>
            </label>
            <select
              id={`${id}-board`}
              className="swiss-select mono"
              value={data.board}
              onChange={(e) => onChange('board', e.target.value)}
            >
              <option value="">Select Board</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chattogram">Chattogram</option>
              <option value="Rajshahi">Rajshahi</option>
              <option value="Khulna">Khulna</option>
              <option value="Barishal">Barishal</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Cumilla">Cumilla</option>
              <option value="Dinajpur">Dinajpur</option>
              <option value="Mymensingh">Mymensingh</option>
              <option value="Madrasah">Madrasah</option>
              <option value="Technical">Technical</option>
              <option value="Cambridge/Edexcel">Cambridge / Edexcel</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor={`${id}-roll`}>
              Roll Number <span className="req-star">*</span>
            </label>
            <input
              id={`${id}-roll`}
              type="text"
              className="swiss-input mono"
              placeholder="ROLL NUMBER"
              value={data.roll}
              onChange={(e) => onChange('roll', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor={`${id}-group`}>
              Group / Major <span className="req-star">*</span>
            </label>
            <select
              id={`${id}-group`}
              className="swiss-select mono"
              value={data.group}
              onChange={(e) => onChange('group', e.target.value)}
            >
              <option value="">Select Group</option>
              <option value="Science">Science</option>
              <option value="Humanities">Humanities</option>
              <option value="Business Studies">Business Studies / Commerce</option>
              <option value="General">General</option>
              <option value="Vocational">Vocational</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor={`${id}-resultType`}>
              Result Type <span className="req-star">*</span>
            </label>
            <select
              id={`${id}-resultType`}
              className="swiss-select mono"
              value={data.resultType}
              onChange={(e) => onChange('resultType', e.target.value)}
            >
              <option value="">Select Result Type</option>
              <option value="GPA (out of 5.00)">GPA (out of 5.00)</option>
              <option value="1st Division">1st Division</option>
              <option value="2nd Division">2nd Division</option>
              <option value="3rd Division">3rd Division</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor={`${id}-gpa`}>
              GPA / Marks <span className="req-star">*</span>
            </label>
            <input
              id={`${id}-gpa`}
              type="text"
              className="swiss-input mono"
              placeholder="e.g. 5.00"
              value={data.gpa}
              onChange={(e) => onChange('gpa', e.target.value)}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor={`${id}-passingYear`}>
              Passing Year <span className="req-star">*</span>
            </label>
            <input
              id={`${id}-passingYear`}
              type="text"
              className="swiss-input mono"
              placeholder="e.g. 2018"
              value={data.passingYear}
              onChange={(e) => onChange('passingYear', e.target.value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface HigherEducationProps {
  id: string;
  secCode: string;
  tierTag: string;
  title: string;
  titleBn: string;
  telemetryTag: string;
  data: HigherEducation;
  onChange: (field: keyof HigherEducation, value: string) => void;
}

export function HigherEducationCard({
  id,
  secCode,
  tierTag,
  title,
  titleBn,
  telemetryTag,
  data,
  onChange,
}: HigherEducationProps) {
  return (
    <section id={id} className="form-card" data-testid={`section-${id}`}>
      <div className="card-header">
        <div className="card-header-left">
          <span className="sec-badge">{secCode}</span>
          <h3 className="card-title">
            {tierTag} {title} <span className="card-title-bn">// {titleBn}</span>
          </h3>
        </div>
        <span className="card-telemetry-tag">{telemetryTag}</span>
      </div>

      <div className="card-body">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor={`${id}-exam`}>
              Examination / Degree Title <span className="req-star">*</span>
            </label>
            <input
              id={`${id}-exam`}
              type="text"
              className="swiss-input"
              placeholder="e.g. B.Sc in CSE / BBA / LL.B."
              value={data.exam}
              onChange={(e) => onChange('exam', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor={`${id}-subject`}>
              Subject / Major Discipline <span className="req-star">*</span>
            </label>
            <input
              id={`${id}-subject`}
              type="text"
              className="swiss-input"
              placeholder="e.g. Computer Science / Finance"
              value={data.subject}
              onChange={(e) => onChange('subject', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor={`${id}-university`}>
              University / Institute Name <span className="req-star">*</span>
            </label>
            <input
              id={`${id}-university`}
              type="text"
              className="swiss-input"
              placeholder="e.g. University of Dhaka"
              value={data.university}
              onChange={(e) => onChange('university', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor={`${id}-resultType`}>
              Result Grading System <span className="req-star">*</span>
            </label>
            <select
              id={`${id}-resultType`}
              className="swiss-select mono"
              value={data.resultType}
              onChange={(e) => onChange('resultType', e.target.value)}
            >
              <option value="">Select Grading System</option>
              <option value="CGPA (out of 4.00)">CGPA (out of 4.00)</option>
              <option value="1st Class">1st Class</option>
              <option value="2nd Class">2nd Class</option>
              <option value="3rd Class">3rd Class</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor={`${id}-cgpa`}>
              Result / CGPA <span className="req-star">*</span>
            </label>
            <input
              id={`${id}-cgpa`}
              type="text"
              className="swiss-input mono"
              placeholder="e.g. 3.85 (OUT OF 4.00)"
              value={data.cgpa}
              onChange={(e) => onChange('cgpa', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor={`${id}-passingYear`}>
              Passing Year <span className="req-star">*</span>
            </label>
            <input
              id={`${id}-passingYear`}
              type="text"
              className="swiss-input mono"
              placeholder="e.g. 2022"
              value={data.passingYear}
              onChange={(e) => onChange('passingYear', e.target.value)}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor={`${id}-courseDuration`}>Course Duration</label>
            <select
              id={`${id}-courseDuration`}
              className="swiss-select mono"
              value={data.courseDuration}
              onChange={(e) => onChange('courseDuration', e.target.value)}
            >
              <option value="">Select Duration</option>
              <option value="4 Years">4 Years Program</option>
              <option value="3 Years">3 Years Program</option>
              <option value="2 Years">2 Years Program</option>
              <option value="1 Year">1 Year Program</option>
              <option value="5 Years">5 Years Combined Degree</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
