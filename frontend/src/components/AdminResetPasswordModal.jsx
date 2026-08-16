import { useEffect, useState } from 'react';

const inputClass =
  'w-full rounded-lg border border-line dark:border-dark-line bg-paper/60 dark:bg-dark-bg px-3.5 py-2.5 text-sm text-ink dark:text-white focus:border-focus-500 focus:ring-1 focus:ring-focus-500 outline-none transition';
const labelClass = 'text-sm font-medium text-ink/80 dark:text-white/80';

export default function AdminResetPasswordModal({ user, onClose, onReset }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setSuccess('');
    }
  }, [user]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      await onReset(user.id, newPassword);
      setSuccess(`Password reset for ${user.name}.`);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reset password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center sm:items-center justify-center bg-ink/40 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-surface dark:bg-dark-surface rounded-t-2xl sm:rounded-xl2 shadow-modal max-h-[92vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Reset password"
      >
        <div className="sticky top-0 z-10 bg-surface dark:bg-dark-surface border-b border-line dark:border-dark-line px-5 sm:px-6 py-4 flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wide text-muted dark:text-dark-muted">
            Reset password
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-muted dark:text-dark-muted hover:text-ink dark:hover:text-white p-1 rounded transition"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 sm:px-6 py-5 space-y-4">
          <p className="text-sm text-muted dark:text-dark-muted">
            Set a new password for <span className="font-medium text-ink dark:text-white">{user.name}</span>{' '}
            ({user.email}). They'll need to sign in with this new password.
          </p>

          {error && (
            <div className="text-sm bg-ember/10 text-ember border border-ember/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          {success && (
            <div className="text-sm bg-focus-50 dark:bg-focus-500/10 text-focus-700 dark:text-focus-300 border border-focus-500/30 rounded-lg px-3 py-2">
              {success}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="reset-new-password" className={labelClass}>
              New password
            </label>
            <input
              id="reset-new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reset-confirm-password" className={labelClass}>
              Confirm password
            </label>
            <input
              id="reset-confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted dark:text-dark-muted hover:bg-paper dark:hover:bg-dark-line transition"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-ink dark:bg-focus-500 dark:hover:bg-focus-600 text-white text-sm font-medium hover:bg-focus-700 transition disabled:opacity-60"
            >
              {saving ? 'Resetting…' : 'Reset password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
