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
        <div className="card-header-icon">👤</div>
        <div>
          <h3 className="card-title">Basic Information</h3>
          <p className="card-description">Personal details, identity numbers, and contact info</p>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="nameEn">Applicant's Name (English)</label>
          <input
            id="nameEn"
            type="text"
            className="form-input"
            placeholder="e.g. MD. RAHMAN"
            value={data.nameEn}
            onChange={(e) => onChange('nameEn', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="nameBn">Applicant's Name (Bangla)</label>
          <input
            id="nameBn"
            type="text"
            className="form-input"
            placeholder="e.g. মোঃ রহমান"
            value={data.nameBn}
            onChange={(e) => onChange('nameBn', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="fatherNameEn">Father's Name (English)</label>
          <input
            id="fatherNameEn"
            type="text"
            className="form-input"
            placeholder="e.g. ABDUL KARIM"
            value={data.fatherNameEn}
            onChange={(e) => onChange('fatherNameEn', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="fatherNameBn">Father's Name (Bangla)</label>
          <input
            id="fatherNameBn"
            type="text"
            className="form-input"
            placeholder="e.g. আব্দুল করিম"
            value={data.fatherNameBn}
            onChange={(e) => onChange('fatherNameBn', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="motherNameEn">Mother's Name (English)</label>
          <input
            id="motherNameEn"
            type="text"
            className="form-input"
            placeholder="e.g. FATIMA BEGUM"
            value={data.motherNameEn}
            onChange={(e) => onChange('motherNameEn', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="motherNameBn">Mother's Name (Bangla)</label>
          <input
            id="motherNameBn"
            type="text"
            className="form-input"
            placeholder="e.g. ফাতেমা বেগম"
            value={data.motherNameBn}
            onChange={(e) => onChange('motherNameBn', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="dob">Date of Birth</label>
          <input
            id="dob"
            type="date"
            className="form-input"
            value={data.dob}
            onChange={(e) => onChange('dob', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            className="form-select"
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
          <label htmlFor="nid">National ID (NID)</label>
          <input
            id="nid"
            type="text"
            className="form-input"
            placeholder="e.g. 19901234567890123"
            value={data.nid}
            onChange={(e) => onChange('nid', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Mobile Number</label>
          <input
            id="phone"
            type="tel"
            className="form-input"
            placeholder="e.g. 01711000000"
            value={data.phone}
            onChange={(e) => onChange('phone', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            className="form-input"
            placeholder="e.g. applicant@example.com"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="bloodGroup">Blood Group</label>
          <select
            id="bloodGroup"
            className="form-select"
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
            className="form-select"
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
            className="form-select"
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

        <div className="form-group">
          <label htmlFor="quota">Quota</label>
          <select
            id="quota"
            className="form-select"
            value={data.quota}
            onChange={(e) => onChange('quota', e.target.value)}
          >
            <option value="">Select Quota</option>
            <option value="Non Quota">Non Quota</option>
            <option value="Freedom Fighter">Freedom Fighter / Child of FF</option>
            <option value="Physically Handicapped">Physically Handicapped</option>
            <option value="Orphan">Orphan</option>
            <option value="Ethnic Minority">Ethnic Minority</option>
            <option value="Ansar-VDP">Ansar-VDP</option>
          </select>
        </div>
      </div>
    </section>
  );
}
