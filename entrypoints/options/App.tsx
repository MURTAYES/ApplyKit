import React, { useState } from 'react';
import { useProfile } from '../../src/hooks/useProfile';
import { Sidebar } from './components/Sidebar';
import { BasicInfoSection } from './components/BasicInfoSection';
import { AddressSection } from './components/AddressSection';
import { SecondaryEducationCard, HigherEducationCard } from './components/EducationSection';
import { ExperienceSection } from './components/ExperienceSection';
import { QualificationsSection } from './components/QualificationsSection';
import { ImportExportActions } from './components/ImportExportActions';
import { DangerZone } from './components/DangerZone';

export default function App() {
  const {
    profile,
    isLoaded,
    updateField,
    addExperience,
    removeExperience,
    updateExperience,
    resetProfile,
    setFullProfile,
  } = useProfile();

  const [activeSection, setActiveSection] = useState('sec-basic');

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isLoaded) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>// LOADING APPLICANT PROFILE...</p>
      </div>
    );
  }

  return (
    <div className="options-container">
      <Sidebar activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="options-main-content">
        {/* Top Master Telemetry Bar */}
        <header className="master-header">
          <div className="telemetry-bar">
            <div className="telemetry-left">
              <span className="sidebar-dot"></span>
              <span style={{ fontWeight: 800, color: 'var(--obsidian)' }}>
                APPLYKIT // APPLICANT PROFILE MANAGER
              </span>
              <span style={{ color: 'var(--hairline)' }}>|</span>
              <span>LOCAL FORM FILLING ENGINE</span>
            </div>
            <div className="telemetry-right">
              <span>STORAGE: <strong style={{ color: 'var(--obsidian)' }}>LOCAL CHROME MV3</strong></span>
              <span className="telemetry-badge">100% PRIVATE</span>
            </div>
          </div>

          <div className="monumental-headline-grid">
            <div>
              <div className="brand-tag">
                // ONE PROFILE • ZERO HASSLE • 1-CLICK AUTOFILL
              </div>
              <h1 className="page-main-title">
                APPLICANT MASTER PROFILE
              </h1>
              <p className="page-subtitle">
                Configure your details once. ApplyKit securely fills supported online job application forms in one click.
              </p>
            </div>

            <div className="registry-meta-card">
              <div className="row strong">
                <span>SECURITY</span>
                <span style={{ color: 'var(--crimson)' }}>LOCAL SANDBOX</span>
              </div>
              <div className="row">
                <span>PRIVACY</span>
                <span>ON-DEVICE ONLY</span>
              </div>
              <div className="row">
                <span>TELEMETRY</span>
                <span>ZERO TRACKING</span>
              </div>
              <div className="row" style={{ fontWeight: 800, color: 'var(--obsidian)', marginTop: '4px' }}>
                <span>STATUS</span>
                <span style={{ color: '#059669' }}>READY TO FILL</span>
              </div>
            </div>
          </div>
        </header>

        {/* Backup and Restore Action Bar */}
        <ImportExportActions
          profile={profile}
          onImportSuccess={setFullProfile}
        />

        {/* Form Sections */}
        <div className="sections-container">
          <BasicInfoSection
            data={profile.basicInfo}
            onChange={(field, val) => updateField('basicInfo', field, val)}
          />

          <AddressSection
            id="sec-present-addr"
            secCode="SEC 02"
            title="PRESENT ADDRESS"
            titleBn="বর্তমান ঠিকানা"
            telemetryTag="ACTIVE CONTACT LOCATION"
            data={profile.presentAddress}
            onChange={(field, val) => updateField('presentAddress', field, val)}
          />

          <AddressSection
            id="sec-permanent-addr"
            secCode="SEC 03"
            title="PERMANENT ADDRESS"
            titleBn="স্থায়ী ঠিকানা"
            telemetryTag="PERMANENT DOMICILE"
            data={profile.permanentAddress}
            onChange={(field, val) => updateField('permanentAddress', field, val)}
          />

          <SecondaryEducationCard
            id="sec-ssc"
            secCode="SEC 04"
            title="S.S.C. / EQUIVALENT LEVEL"
            titleBn="মাধ্যমিক বা সমমান"
            telemetryTag="SECONDARY EDUCATION"
            data={profile.ssc}
            onChange={(field, val) => updateField('ssc', field, val)}
          />

          <SecondaryEducationCard
            id="sec-hsc"
            secCode="SEC 05"
            title="H.S.C. / EQUIVALENT LEVEL"
            titleBn="উচ্চ মাধ্যমিক বা সমমান"
            telemetryTag="HIGHER SECONDARY"
            data={profile.hsc}
            onChange={(field, val) => updateField('hsc', field, val)}
          />

          <HigherEducationCard
            id="sec-graduation"
            secCode="SEC 06"
            title="GRADUATION / EQUIVALENT LEVEL"
            titleBn="স্নাতক বা সমমান"
            telemetryTag="UNDERGRADUATE DEGREE"
            data={profile.graduation}
            onChange={(field, val) => updateField('graduation', field, val)}
          />

          <HigherEducationCard
            id="sec-masters"
            secCode="SEC 07"
            title="MASTERS / POST-GRADUATION LEVEL"
            titleBn="স্নাতকোত্তর বা সমমান"
            telemetryTag="POST-GRADUATE (OPTIONAL)"
            data={profile.masters}
            onChange={(field, val) => updateField('masters', field, val)}
          />

          <ExperienceSection
            experiences={profile.jobExperiences}
            onAdd={addExperience}
            onRemove={removeExperience}
            onChange={updateExperience}
          />

          <QualificationsSection
            data={profile.otherQualifications}
            onChange={(field, val) => updateField('otherQualifications', field, val)}
          />

          <DangerZone onDeleteAll={resetProfile} />
        </div>
      </main>
    </div>
  );
}
