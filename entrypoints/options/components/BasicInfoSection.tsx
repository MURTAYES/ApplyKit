import React from 'react';
import { BasicInfo } from '../../../src/types/profile';

interface BasicInfoSectionProps {
  data: BasicInfo;
  onChange: (field: keyof BasicInfo, value: string) => void;
}

export function BasicInfoSection({ data, onChange }: BasicInfoSectionProps) {
  return (
    <section id="sec-basic" className="form-card" data-testid="section-basic">
      <div className="card-header">
        <div className="card-header-left">
          <span className="sec-badge">SEC 01</span>
          <h3 className="card-title">
            BASIC INFORMATION <span className="card-title-bn">// আবেদনকারীর প্রাথমিক তথ্য</span>
          </h3>
        </div>
        <span className="card-telemetry-tag">MANDATORY CIVIC DATA</span>
      </div>

      <div className="card-body">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nameEn">
              Applicant's Name (English) <span className="req-star">*</span>
            </label>
            <input
              id="nameEn"
              type="text"
              className="swiss-input"
              placeholder="e.g. MICHAEL J. ROSS"
              value={data.nameEn}
              onChange={(e) => onChange('nameEn', e.target.value)}
            />
            <span className="field-hint">AS RECORDED IN CERTIFICATES &amp; NATIONAL IDENTITY</span>
          </div>

          <div className="form-group">
            <label htmlFor="nameBn">
              Applicant's Name (Bangla) <span className="req-star">*</span>
            </label>
            <input
              id="nameBn"
              type="text"
              className="swiss-input"
              placeholder="আবেদনকারীর পুরো নাম লিখুন"
              value={data.nameBn}
              onChange={(e) => onChange('nameBn', e.target.value)}
            />
            <span className="field-hint">বাংলা জাতীয় পরিচয়পত্র অনুযায়ী সঠিক বানান</span>
          </div>

          <div className="form-group">
            <label htmlFor="fatherNameEn">
              Father's Name (English) <span className="req-star">*</span>
            </label>
            <input
              id="fatherNameEn"
              type="text"
              className="swiss-input"
              placeholder="FULL NAME OF FATHER"
              value={data.fatherNameEn}
              onChange={(e) => onChange('fatherNameEn', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fatherNameBn">
              Father's Name (Bangla) <span className="req-star">*</span>
            </label>
            <input
              id="fatherNameBn"
              type="text"
              className="swiss-input"
              placeholder="পিতার পুরো নাম লিখুন"
              value={data.fatherNameBn}
              onChange={(e) => onChange('fatherNameBn', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="motherNameEn">
              Mother's Name (English) <span className="req-star">*</span>
            </label>
            <input
              id="motherNameEn"
              type="text"
              className="swiss-input"
              placeholder="FULL NAME OF MOTHER"
              value={data.motherNameEn}
              onChange={(e) => onChange('motherNameEn', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="motherNameBn">
              Mother's Name (Bangla) <span className="req-star">*</span>
            </label>
            <input
              id="motherNameBn"
              type="text"
              className="swiss-input"
              placeholder="মাতার পুরো নাম লিখুন"
              value={data.motherNameBn}
              onChange={(e) => onChange('motherNameBn', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="dob">
              Date of Birth <span className="req-star">*</span>
            </label>
            <input
              id="dob"
              type="date"
              className="swiss-input mono"
              value={data.dob}
              onChange={(e) => onChange('dob', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">
              Gender <span className="req-star">*</span>
            </label>
            <select
              id="gender"
              className="swiss-select mono"
              value={data.gender}
              onChange={(e) => onChange('gender', e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Third Gender">Third Gender</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="nid">
              National ID (NID) <span className="req-star">*</span>
            </label>
            <input
              id="nid"
              type="text"
              className="swiss-input mono"
              placeholder="10 OR 17 DIGIT NID"
              value={data.nid}
              onChange={(e) => onChange('nid', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              Mobile Number <span className="req-star">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              className="swiss-input mono"
              placeholder="+880 1XXXXXXXXX"
              value={data.phone}
              onChange={(e) => onChange('phone', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email Address <span className="req-star">*</span>
            </label>
            <input
              id="email"
              type="email"
              className="swiss-input mono"
              placeholder="applicant@domain.com"
              value={data.email}
              onChange={(e) => onChange('email', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bloodGroup">Blood Group</label>
            <select
              id="bloodGroup"
              className="swiss-select mono"
              value={data.bloodGroup}
              onChange={(e) => onChange('bloodGroup', e.target.value)}
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="religion">Religion</label>
            <select
              id="religion"
              className="swiss-select"
              value={data.religion}
              onChange={(e) => onChange('religion', e.target.value)}
            >
              <option value="">Select Religion</option>
              <option value="Islam">Islam</option>
              <option value="Hinduism">Hinduism</option>
              <option value="Buddhism">Buddhism</option>
              <option value="Christianity">Christianity</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="maritalStatus">Marital Status</label>
            <select
              id="maritalStatus"
              className="swiss-select"
              value={data.maritalStatus}
              onChange={(e) => onChange('maritalStatus', e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Widowed">Widowed</option>
              <option value="Divorced">Divorced</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label htmlFor="quota">Quota / Special Classification</label>
            <select
              id="quota"
              className="swiss-select mono"
              value={data.quota}
              onChange={(e) => onChange('quota', e.target.value)}
            >
              <option value="">Non Quota / Standard Merit</option>
              <option value="Freedom Fighter">Freedom Fighter / Descendant</option>
              <option value="Physically Handicapped">Physically Handicapped</option>
              <option value="Orphan">Orphan</option>
              <option value="Ethnic Minority">Ethnic Minority</option>
              <option value="Ansar-VDP">Ansar-VDP</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
