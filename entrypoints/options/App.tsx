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
        <p>Loading Donna profile...</p>
      </div>
    );
  }

  return (
    <div className="options-container">
      <Sidebar activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="options-main-content">
        <header className="page-header">
          <div className="page-header-text">
            <h1 className="page-main-title">Applicant Profile</h1>
            <p className="page-subtitle">
              Donna fills matching form fields using this data. All fields are optional and stored strictly locally.
            </p>
          </div>

          <ImportExportActions
            profile={profile}
            onImportSuccess={setFullProfile}
          />
        </header>

        <div className="sections-container">
          <BasicInfoSection
            data={profile.basicInfo}
            onChange={(field, val) => updateField('basicInfo', field, val)}
          />

          <AddressSection
            id="sec-present-addr"
            title="Present Address"
            description="Your current residential address"
            icon="📍"
            data={profile.presentAddress}
            onChange={(field, val) => updateField('presentAddress', field, val)}
          />

          <AddressSection
            id="sec-permanent-addr"
            title="Permanent Address"
            description="Your permanent/home district address"
            icon="🏠"
            data={profile.permanentAddress}
            onChange={(field, val) => updateField('permanentAddress', field, val)}
          />

          <SecondaryEducationCard
            id="sec-ssc"
            title="SSC / Dakhil / Equivalent"
            description="Secondary School Certificate details"
            icon="🎓"
            data={profile.ssc}
            onChange={(field, val) => updateField('ssc', field, val)}
          />

          <SecondaryEducationCard
            id="sec-hsc"
            title="HSC / Alim / Equivalent"
            description="Higher Secondary Certificate details"
            icon="📜"
            data={profile.hsc}
            onChange={(field, val) => updateField('hsc', field, val)}
          />

          <HigherEducationCard
            id="sec-graduation"
            title="Graduation / Bachelor's Degree"
            description="Undergraduate academic credentials"
            icon="🏛️"
            data={profile.graduation}
            onChange={(field, val) => updateField('graduation', field, val)}
          />

          <HigherEducationCard
            id="sec-masters"
            title="Masters / Post-Graduation (Optional)"
            description="Postgraduate academic credentials if applicable"
            icon="📚"
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
