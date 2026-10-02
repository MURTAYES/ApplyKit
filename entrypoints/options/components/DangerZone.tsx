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
            RESET PROFILE <span className="card-title-bn">// তথ্য রিসেট ও নিয়ন্ত্রণ</span>
          </h3>
        </div>
        <span className="card-telemetry-tag">LOCAL STORAGE CLEAR</span>
      </div>

      <div className="danger-content">
        <div className="danger-description-block">
          <strong>RESET ALL LOCAL PROFILE DATA</strong>
          <p>
            This operation clears all stored personal, educational, and professional data from the browser's local sandbox storage.
            Ensure you export a backup JSON file beforehand if you wish to retain your data.
          </p>
        </div>

        {!showConfirm ? (
          <button
            type="button"
            className="btn-danger"
            onClick={() => setShowConfirm(true)}
            data-testid="delete-all-btn"
          >
            Clear All Profile Data
          </button>
        ) : (
          <div className="confirm-modal-box" data-testid="delete-confirm-box">
            <p className="confirm-warning-text">
              ⚠ Caution: Are you sure? This action will permanently wipe all profile data from local storage.
            </p>
            <div className="confirm-btn-row">
              <button
                type="button"
                className="btn-confirm-delete"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                data-testid="confirm-delete-btn"
              >
                {isDeleting ? 'Clearing Storage...' : 'Yes, Clear All Data'}
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
            ✓ All profile data successfully cleared from local storage.
          </div>
        )}
      </div>
    </section>
  );
}
