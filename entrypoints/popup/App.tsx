import React, { useState } from 'react';
import { FillReport } from '../../src/engine/fillEngine';

export default function App() {
  const [report, setReport] = useState<FillReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFilling, setIsFilling] = useState<boolean>(false);

  const handleFill = async () => {
    setIsFilling(true);
    setErrorMessage(null);
    setReport(null);

    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.id) {
          setErrorMessage('No active browser tab found.');
          setIsFilling(false);
          return;
        }

        const tabId = tab.id;
        const tabUrl = tab.url || '';

        // Check restricted URLs (chrome://, edge://, file://, chrome web store)
        if (
          tabUrl.startsWith('chrome://') ||
          tabUrl.startsWith('edge://') ||
          tabUrl.startsWith('chrome-extension://') ||
          tabUrl.includes('chromewebstore.google.com')
        ) {
          setErrorMessage('ApplyKit cannot autofill browser internal or restricted pages. Please navigate to a job application website.');
          setIsFilling(false);
          return;
        }

        const sendFillMessage = () => {
          chrome.tabs.sendMessage(tabId, { action: 'TRIGGER_FILL' }, (response) => {
            if (chrome.runtime.lastError) {
              setErrorMessage(`Injection failed: ${chrome.runtime.lastError.message || 'Permission denied on this tab'}`);
              setIsFilling(false);
              return;
            }

            if (response && response.success && response.report) {
              setReport(response.report);
            } else {
              setErrorMessage(response?.error || 'Unknown error occurred during autofill.');
            }
            setIsFilling(false);
          });
        };

        // Attempt direct messaging first
        chrome.tabs.sendMessage(tabId, { action: 'TRIGGER_FILL' }, (response) => {
          if (chrome.runtime.lastError) {
            // Dynamic content script injection via activeTab scripting API (SCAF-04)
            if (chrome.scripting && chrome.scripting.executeScript) {
              chrome.scripting.executeScript(
                {
                  target: { tabId },
                  files: ['content-scripts/content.js'],
                },
                () => {
                  if (chrome.runtime.lastError) {
                    setErrorMessage(`Script injection restricted: ${chrome.runtime.lastError.message || 'Enable extension access'}`);
                    setIsFilling(false);
                    return;
                  }
                  setTimeout(sendFillMessage, 100);
                }
              );
            } else {
              setErrorMessage('Please reload the page to enable form filling.');
              setIsFilling(false);
            }
            return;
          }

          if (response && response.success && response.report) {
            setReport(response.report);
          } else {
            setErrorMessage(response?.error || 'Unknown error occurred during autofill.');
          }
          setIsFilling(false);
        });
      } catch (err: any) {
        setErrorMessage(err.message || 'Runtime error');
        setIsFilling(false);
      }
    } else {
      // Dev/Test simulation
      setReport({
        filledCount: 18,
        skippedCount: 3,
        unmatchedCount: 2,
        details: [
          { fieldName: 'Candidate Name (English)', section: 'basic_info', status: 'filled' },
          { fieldName: 'Passport Number', section: 'basic_info', status: 'unmatched' },
          { fieldName: 'Fax Number', section: 'other_qualifications', status: 'unmatched' },
        ],
      });
      setIsFilling(false);
    }
  };

  const handleOpenProfile = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    }
  };

  const handleReset = () => {
    setReport(null);
    setErrorMessage(null);
  };

  const unmatchedDetails = report?.details?.filter((d) => d.status === 'unmatched') || [];

  return (
    <div className="popup-container">
      <header className="popup-header">
        <div className="popup-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg viewBox="0 0 128 128" width="28" height="28" style={{ flexShrink: 0 }}>
              <rect width="128" height="128" fill="#0A0A0A" />
              <rect x="24" y="24" width="34" height="34" fill="#BC0009" />
              <rect x="24" y="70" width="34" height="34" fill="#FFFFFF" />
              <rect x="70" y="24" width="34" height="80" fill="#FFFFFF" />
            </svg>
            <div>
              <h1 className="popup-title" style={{ margin: 0 }}>ApplyKit</h1>
              <span className="popup-subtitle">Smart Form Autofiller</span>
            </div>
          </div>
          <span className="popup-tag">LOCAL SANDBOX</span>
        </div>
      </header>

      <main className="popup-body">
        {errorMessage && (
          <div className="error-banner" data-testid="error-banner">
            <div className="error-header">
              <span>⚠ ALERT</span>
              <button type="button" className="btn-dismiss" onClick={() => setErrorMessage(null)}>✕</button>
            </div>
            <p className="error-text">{errorMessage}</p>
          </div>
        )}

        {!report ? (
          <button
            type="button"
            className="fill-button"
            onClick={handleFill}
            disabled={isFilling}
            data-testid="fill-button"
          >
            <span className="fill-icon">{isFilling ? '⏳' : '⚡'}</span>
            {isFilling ? 'Filling Application...' : 'Fill Form'}
          </button>
        ) : (
          <div className="report-dashboard" data-testid="report-dashboard">
            <div className="report-header">
              <span className="report-badge">AUTOFILL SUMMARY</span>
              <span className="report-status">✓ COMPLETE</span>
            </div>

            <div className="metrics-grid">
              <div className="metric-card metric-filled" data-testid="metric-filled">
                <span className="metric-val">{report.filledCount}</span>
                <span className="metric-label">FILLED</span>
              </div>
              <div className="metric-card metric-skipped" data-testid="metric-skipped">
                <span className="metric-val">{report.skippedCount}</span>
                <span className="metric-label">SKIPPED</span>
              </div>
              <div className="metric-card metric-unmatched" data-testid="metric-unmatched">
                <span className="metric-val">{report.unmatchedCount}</span>
                <span className="metric-label">UNMATCHED</span>
              </div>
            </div>

            {unmatchedDetails.length > 0 && (
              <details className="unmatched-accordion" data-testid="unmatched-accordion">
                <summary className="unmatched-summary">
                  Unmatched Fields ({unmatchedDetails.length}) ▾
                </summary>
                <ul className="unmatched-list">
                  {unmatchedDetails.map((item, idx) => (
                    <li key={idx} className="unmatched-item">
                      <span className="unmatched-name">{item.fieldName}</span>
                      {item.section && <span className="unmatched-sec">[{item.section}]</span>}
                    </li>
                  ))}
                </ul>
              </details>
            )}

            <button
              type="button"
              className="reset-button"
              onClick={handleReset}
              data-testid="reset-report-btn"
            >
              Fill Again / Reset
            </button>
          </div>
        )}
      </main>

      <footer className="popup-footer">
        <span className="footer-status-tag">Ready</span>
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
