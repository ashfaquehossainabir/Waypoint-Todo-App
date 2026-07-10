import "../styles/ConfirmLogoutModal.css";

export default function ConfirmLogoutModal({ open, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="logout-modal-overlay" onClick={onCancel}>
      <div
        className="logout-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h3 className="logout-title">Confirm sign out</h3>
        <p className="logout-text">
          Are you sure you want to sign out of your account?
        </p>

        <div className="logout-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-danger" onClick={onConfirm}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}