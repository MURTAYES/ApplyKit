import React, { useState } from 'react';

export default function App() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isFilling, setIsFilling] = useState<boolean>(false);

  const handleFill = async () => {
    setIsFilling(true);
    setStatusMessage('// EXECUTING FORM DETECTION...');

    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.id) {
          setStatusMessage('! ERROR: NO ACTIVE TAB FOUND');
          setIsFilling(false);
          return;
        }

        const tabId = tab.id;

        const sendFillMessage = () => {
          chrome.tabs.sendMessage(tabId, { action: 'TRIGGER_FILL' }, (response) => {
            if (chrome.runtime.lastError) {
              setStatusMessage(`! INJECTION FAILED: ${chrome.runtime.lastError.message || 'PERMISSION DENIED'}`);
              setIsFilling(false);
              return;
            }

            if (response && response.success && response.report) {
              const { filledCount, unmatchedCount, skippedCount } = response.report;
              if (filledCount > 0) {
                setStatusMessage(`✓ FILLED ${filledCount} FIELDS (${unmatchedCount} UNMATCHED, ${skippedCount} SKIPPED)`);
              } else {
                setStatusMessage(`// NO MATCHING EMPTY FIELDS (${unmatchedCount} UNMATCHED)`);
              }
            } else {
              setStatusMessage(`! FILL ERROR: ${response?.error || 'UNKNOWN ERROR'}`);
            }
            setIsFilling(false);
          });
        };

        // First attempt direct messaging
        chrome.tabs.sendMessage(tabId, { action: 'TRIGGER_FILL' }, (response) => {
          if (chrome.runtime.lastError) {
            // Content script not loaded yet; inject dynamically via scripting API (SCAF-04)
            if (chrome.scripting && chrome.scripting.executeScript) {
              chrome.scripting.executeScript(
                {
                  target: { tabId },
                  files: ['content-scripts/content.js'],
                },
                () => {
                  if (chrome.runtime.lastError) {
                    setStatusMessage(`! INJECTION FAILED: ${chrome.runtime.lastError.message || 'ENABLE FILE ACCESS IN EXTENSION SETTINGS'}`);
                    setIsFilling(false);
                    return;
                  }
                  // Small delay to ensure content script listener is bound
                  setTimeout(sendFillMessage, 100);
                }
              );
            } else {
              setStatusMessage(`! RELOAD TAB TO INJECT CONTENT SCRIPT`);
              setIsFilling(false);
            }
            return;
          }

          if (response && response.success && response.report) {
            const { filledCount, unmatchedCount, skippedCount } = response.report;
            if (filledCount > 0) {
              setStatusMessage(`✓ FILLED ${filledCount} FIELDS (${unmatchedCount} UNMATCHED, ${skippedCount} SKIPPED)`);
            } else {
              setStatusMessage(`// NO MATCHING EMPTY FIELDS (${unmatchedCount} UNMATCHED)`);
            }
          } else {
            setStatusMessage(`! FILL ERROR: ${response?.error || 'UNKNOWN ERROR'}`);
          }
          setIsFilling(false);
        });
      } catch (err: any) {
        setStatusMessage(`! FAILED: ${err.message || 'RUNTIME ERROR'}`);
        setIsFilling(false);
      }
    } else {
      // Fallback for tests/environments without tabs API
      setStatusMessage('// DEV SIMULATION: FILL COMPLETE');
      setIsFilling(false);
    }
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
          disabled={isFilling}
          data-testid="fill-button"
        >
          <span className="fill-icon">{isFilling ? '⏳' : '⚡'}</span>
          {isFilling ? 'Filling...' : 'Fill Form'}
        </button>

        {statusMessage && (
          <div className="toast-banner" data-testid="toast-banner">
            {statusMessage}
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
