import React, { useState } from 'react';

export default function App() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleFill = () => {
    setToastMessage('Fill engine will be active in Phase 2');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenProfile = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    }
  };

  return (
    <div className="popup-container">
      <div className="popup-header">
        <div className="popup-brand">
          <div className="popup-logo">D</div>
          <div>
            <h1 className="popup-title">Donna</h1>
            <p className="popup-subtitle">Job Application Autofill</p>
          </div>
        </div>
      </div>

      <div className="popup-body">
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
      </div>

      <div className="popup-footer">
        <button
          type="button"
          className="profile-link-button"
          onClick={handleOpenProfile}
          data-testid="open-profile-btn"
        >
          Open Profile ↗
        </button>
      </div>
    </div>
  );
}
