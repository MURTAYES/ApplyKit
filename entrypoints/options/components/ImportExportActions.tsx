import React, { useRef, useState } from 'react';
import { Profile } from '../../../src/types/profile';
import { exportProfileToJson, importProfileFromJson } from '../../../src/utils/exportImport';

interface ImportExportActionsProps {
  profile: Profile;
  onImportSuccess: (imported: Profile) => void;
}

export function ImportExportActions({
  profile,
  onImportSuccess,
}: ImportExportActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  const handleExport = () => {
    exportProfileToJson(profile);
    setFeedback({ message: '// DOSSIER EXPORTED SUCCESSFULLY AS JSON SPEC', isError: false });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = importProfileFromJson(text);
      if (result.success && result.data) {
        onImportSuccess(result.data);
        setFeedback({ message: '// DOSSIER PARSED, VALIDATED AND PERSISTED TO LOCAL STORAGE', isError: false });
      } else {
        setFeedback({ message: `// ERROR: ${result.error || 'INVALID PAYLOAD'}`, isError: true });
      }
    } catch {
      setFeedback({ message: '// ERROR: UNABLE TO READ SELECTED FILE', isError: true });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  return (
    <div className="backup-restore-bar">
      <div className="backup-label-wrap">
        <span className="backup-title">DOSSIER BACKUP &amp; PORTABILITY // তথ্য সংরক্ষণ</span>
        <span className="backup-desc">EXPORT SANITIZED JSON DOSSIER OR IMPORT PRIOR SPECIFICATION</span>
      </div>

      <div className="action-button-group">
        <button
          type="button"
          className="btn-action btn-export"
          onClick={handleExport}
          data-testid="export-profile-btn"
        >
          <span>↑</span> Export JSON [EX-01]
        </button>

        <button
          type="button"
          className="btn-action btn-import"
          onClick={() => fileInputRef.current?.click()}
          data-testid="import-profile-btn"
        >
          <span>↓</span> Import JSON [IM-01]
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          data-testid="import-file-input"
        />
      </div>

      {feedback && (
        <div
          className={`status-message ${feedback.isError ? 'status-error' : 'status-success'}`}
          style={{ width: '100%' }}
          data-testid="import-export-feedback"
        >
          {feedback.message}
        </div>
      )}
    </div>
  );
}
