import React, { useState } from 'react';

interface DangerZoneProps {
  onDeleteAll: () => Promise<void>;
}

export function DangerZone({ onDeleteAll }: DangerZoneProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletedNotice, setDeletedNotice] = useState(false);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    await onDeleteAll();
    setIsDeleting(false);
    setShowConfirm(false);
    setDeletedNotice(true);
    setTimeout(() => setDeletedNotice(false), 4000);
  };

  return (
    <section id="sec-danger" className="form-card danger-card" data-testid="section-danger">
      <div className="card-header danger-header">
        <div className="card-header-left">
          <span className="sec-badge">SEC 10</span>
          <h3 className="card-title">
            DANGER ZONE <span className="card-title-bn">// সংবেদনশীল নিয়ন্ত্রণ</span>
          </h3>
        </div>
        <span className="card-telemetry-tag">IRREVOCABLE STORAGE PURGE</span>
      </div>

      <div className="danger-content">
        <div className="danger-description-block">
          <strong>PURGE ALL LOCAL DOSSIER STORAGE</strong>
          <p>
            This operation irrevocably clears all stored personal, educational, and professional data from the browser's local sandbox storage.
            Ensure an export backup is saved beforehand if retention is required.
          </p>
        </div>

        {!showConfirm ? (
          <button
            type="button"
            className="btn-danger"
            onClick={() => setShowConfirm(true)}
            data-testid="delete-all-btn"
          >
            DELETE ALL PROFILE DATA [PURGE]
          </button>
        ) : (
          <div className="confirm-modal-box" data-testid="delete-confirm-box">
            <p className="confirm-warning-text">
              // CAUTION: ARE YOU ABSOLUTELY CERTAIN? THIS ACTION PERMANENTLY WIPES ALL STORED APPLICANT VALUES.
            </p>
            <div className="confirm-btn-row">
              <button
                type="button"
                className="btn-confirm-delete"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                data-testid="confirm-delete-btn"
              >
                {isDeleting ? 'PURGING STORAGE...' : 'YES, PURGE ALL DATA'}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                data-testid="cancel-delete-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {deletedNotice && (
          <div className="status-message status-success" data-testid="deleted-notice">
            // STATUS: ALL PROFILE RECORDS EXPUNGED FROM LOCAL STORAGE
          </div>
        )}
      </div>
    </section>
  );
}
