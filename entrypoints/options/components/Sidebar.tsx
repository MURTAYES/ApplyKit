import React from 'react';

interface SidebarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const SECTIONS = [
  { id: 'sec-basic', label: 'Basic Information', icon: '👤' },
  { id: 'sec-present-addr', label: 'Present Address', icon: '📍' },
  { id: 'sec-permanent-addr', label: 'Permanent Address', icon: '🏠' },
  { id: 'sec-ssc', label: 'SSC / Equivalent', icon: '🎓' },
  { id: 'sec-hsc', label: 'HSC / Equivalent', icon: '📜' },
  { id: 'sec-graduation', label: 'Graduation', icon: '🏛️' },
  { id: 'sec-masters', label: 'Masters (Optional)', icon: '📚' },
  { id: 'sec-experience', label: 'Job Experience', icon: '💼' },
  { id: 'sec-qualifications', label: 'Other Qualifications', icon: '⭐' },
  { id: 'sec-danger', label: 'Manage & Danger Zone', icon: '⚙️' },
];

export function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  return (
    <aside className="options-sidebar" aria-label="Profile Sections">
      <div className="sidebar-header">
        <div className="sidebar-logo">D</div>
        <div className="sidebar-title-wrap">
          <h2 className="sidebar-title">Donna Profile</h2>
          <span className="sidebar-tag">Applicant Data</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <li key={sec.id} className="sidebar-menu-item">
                <button
                  type="button"
                  className={`sidebar-nav-button ${isActive ? 'active' : ''}`}
                  onClick={() => onNavigate(sec.id)}
                  data-testid={`nav-${sec.id}`}
                >
                  <span className="nav-icon">{sec.icon}</span>
                  <span className="nav-label">{sec.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
