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
      <div className="card-header">
        <div className="card-header-icon danger-icon">⚠️</div>
        <div>
          <h3 className="card-title danger-title">Danger Zone</h3>
          <p className="card-description">Permanent actions and data clearing</p>
        </div>
      </div>

      <div className="danger-content">
        <div className="danger-description-block">
          <strong>Delete All Profile Data</strong>
          <p>
            This action will permanently erase all saved profile information from your local browser storage.
            Make sure to export a backup if you wish to keep a copy.
          </p>
        </div>

        {!showConfirm ? (
          <button
            type="button"
            className="btn-danger"
            onClick={() => setShowConfirm(true)}
            data-testid="delete-all-btn"
          >
            🗑️ Delete All Profile Data
          </button>
        ) : (
          <div className="confirm-modal-box" data-testid="delete-confirm-box">
            <p className="confirm-warning-text">
              Are you sure? This cannot be undone unless you have a JSON backup.
            </p>
            <div className="confirm-btn-row">
              <button
                type="button"
                className="btn-confirm-delete"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                data-testid="confirm-delete-btn"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Everything'}
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
            All profile data has been wiped from storage.
          </div>
        )}
      </div>
    </section>
  );
}
