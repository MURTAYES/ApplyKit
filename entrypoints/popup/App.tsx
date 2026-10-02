import React, { useState } from 'react';

export default function App() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleFill = () => {
    setToastMessage('// INJECTION ENGINE ENGAGES IN PHASE 2');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenProfile = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    }
  };

  return (
    <div className="popup-container">
      <header className="popup-header">
        <div className="popup-telemetry-top">
          <div>
            <span className="telemetry-dot"></span>
            <span>DONNA // FORM FILLER</span>
          </div>
          <span className="telemetry-tag">MV3 LOCAL</span>
        </div>

        <div className="popup-brand">
          <h1 className="popup-title">DONNA</h1>
          <span className="popup-subtitle">// DOSSIER FILLER</span>
        </div>
      </header>

      <main className="popup-body">
        <button
          type="button"
          className="fill-button"
          onClick={handleFill}
          data-testid="fill-button"
        >
          <span className="fill-icon">⚡</span>
          Fill Form
        </button>

        {toastMessage && (
          <div className="toast-banner" data-testid="toast-banner">
            {toastMessage}
          </div>
        )}
      </main>

      <footer className="popup-footer">
        <span className="footer-docket-info">REF: [FORM-AP-704]</span>
        <button
          type="button"
          className="profile-link-button"
          onClick={handleOpenProfile}
          data-testid="open-profile-btn"
        >
          Open Profile ↗
        </button>
      </footer>
    </div>
  );
}
