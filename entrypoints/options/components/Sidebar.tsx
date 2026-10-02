import React from 'react';

interface SidebarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const SECTIONS = [
  { id: 'sec-basic', code: '01', label: 'Basic Information', bn: 'প্রাথমিক তথ্য' },
  { id: 'sec-present-addr', code: '02', label: 'Present Address', bn: 'বর্তমান ঠিকানা' },
  { id: 'sec-permanent-addr', code: '03', label: 'Permanent Address', bn: 'স্থায়ী ঠিকানা' },
  { id: 'sec-ssc', code: '04', label: 'SSC / Equivalent', bn: 'মাধ্যমিক' },
  { id: 'sec-hsc', code: '05', label: 'HSC / Equivalent', bn: 'উচ্চ মাধ্যমিক' },
  { id: 'sec-graduation', code: '06', label: 'Graduation Degree', bn: 'স্নাতক' },
  { id: 'sec-masters', code: '07', label: 'Masters (Optional)', bn: 'স্নাতকোত্তর' },
  { id: 'sec-experience', code: '08', label: 'Job Experience', bn: 'চাকুরীর বিবরণ' },
  { id: 'sec-qualifications', code: '09', label: 'Other Qualifications', bn: 'অন্যান্য যোগ্যতা' },
  { id: 'sec-danger', code: '10', label: 'Danger Zone', bn: 'তথ্য নিয়ন্ত্রণ' },
];

export function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  return (
    <aside className="options-sidebar" aria-label="Profile Sections">
      <div className="sidebar-header">
        <div className="sidebar-brand-row">
          <span className="sidebar-dot"></span>
          <span>DONNA // CLIENT DOSSIER</span>
        </div>
        <h2 className="sidebar-title">APPLICANT REGISTRY</h2>
        <div className="sidebar-subtitle">// SWISS DISCIPLINE ARCHIVE</div>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <li key={sec.id}>
                <button
                  type="button"
                  className={`sidebar-nav-button ${isActive ? 'active' : ''}`}
                  onClick={() => onNavigate(sec.id)}
                  data-testid={`nav-${sec.id}`}
                >
                  <div>
                    <span className="nav-code">[{sec.code}]</span>
                    <span>{sec.label}</span>
                  </div>
                  <span className="nav-arrow">→</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
