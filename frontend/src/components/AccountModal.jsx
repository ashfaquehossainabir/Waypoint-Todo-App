import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const inputClass =
  'w-full rounded-lg border border-line dark:border-dark-line bg-paper/60 dark:bg-dark-bg px-3.5 py-2.5 text-sm text-ink dark:text-white focus:border-focus-500 focus:ring-1 focus:ring-focus-500 outline-none transition';
const labelClass = 'text-sm font-medium text-ink/80 dark:text-white/80';

function Banner({ tone = 'error', children }) {
  const toneClass =
    tone === 'success'
      ? 'bg-focus-50 dark:bg-focus-500/10 text-focus-700 dark:text-focus-300 border-focus-300/50 dark:border-focus-500/30'
      : 'bg-ember/10 text-ember border-ember/30';
  return <div className={`text-sm rounded-lg px-3 py-2 border ${toneClass}`}>{children}</div>;
}

function SectionHeading({ children }) {
  return (
    <h3 className="text-xs font-mono uppercase tracking-wide text-muted dark:text-dark-muted mb-3">
      {children}
    </h3>
  );
}

export default function AccountModal({ open, onClose }) {
  const { user, updateProfile, updatePassword, deleteAccount, logout } = useAuth();

  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [profileStatus, setProfileStatus] = useState({ error: '', success: '', saving: false });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordStatus, setPasswordStatus] = useState({ error: '', success: '', saving: false });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteStatus, setDeleteStatus] = useState({ error: '', deleting: false });

  useEffect(() => {
    if (open && user) {
      setProfileForm({ name: user.name || '', email: user.email || '' });
      setProfileStatus({ error: '', success: '', saving: false });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordStatus({ error: '', success: '', saving: false });
      setShowDeleteConfirm(false);
      setDeletePassword('');
      setDeleteStatus({ error: '', deleting: false });
    }
  }, [open, user]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      setProfileStatus({ error: 'Name and email are required.', success: '', saving: false });
      return;
    }
    setProfileStatus({ error: '', success: '', saving: true });
    try {
      await updateProfile(profileForm.name.trim(), profileForm.email.trim());
      setProfileStatus({ error: '', success: 'Profile updated.', saving: false });
    } catch (err) {
      setProfileStatus({
        error: err.response?.data?.message || 'Could not update profile.',
        success: '',
        saving: false,
      });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordStatus({ error: 'Fill in both password fields.', success: '', saving: false });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordStatus({
        error: 'New password must be at least 6 characters.',
        success: '',
        saving: false,
      });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ error: 'New passwords do not match.', success: '', saving: false });
      return;
    }
    setPasswordStatus({ error: '', success: '', saving: true });
    try {
      await updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordStatus({ error: '', success: 'Password updated.', saving: false });
    } catch (err) {
      setPasswordStatus({
        error: err.response?.data?.message || 'Could not update password.',
        success: '',
        saving: false,
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteStatus({ error: 'Enter your password to confirm.', deleting: false });
      return;
    }
    setDeleteStatus({ error: '', deleting: true });
    try {
      await deleteAccount(deletePassword);
      onClose();
    } catch (err) {
      setDeleteStatus({
        error: err.response?.data?.message || 'Could not delete account.',
        deleting: false,
      });
    }
  };

  const handleSignOut = () => {
    onClose();
    logout();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/40 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-surface dark:bg-dark-surface rounded-t-2xl sm:rounded-xl2 shadow-modal max-h-[92vh] sm:max-h-[88vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Account settings"
      >
        {/* ===== HEADER ===== */}
        <div className="sticky top-0 z-10 bg-surface dark:bg-dark-surface border-b border-line dark:border-dark-line px-5 sm:px-6 py-4 flex items-center gap-3">
          <span className="h-9 w-9 shrink-0 rounded-full bg-ink dark:bg-focus-500 text-white font-display font-semibold text-sm flex items-center justify-center">
            {getInitials(user?.name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink dark:text-white leading-tight truncate">
              {user?.name}
            </p>
            <p className="text-xs text-muted dark:text-dark-muted leading-tight truncate">
              {user?.email}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-muted dark:text-dark-muted hover:text-ink dark:hover:text-white p-1 rounded transition shrink-0"
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

        {/* ===== BODY ===== */}
        <div className="px-5 sm:px-6 py-5 space-y-8">
          {/* Edit profile */}
          <section>
            <SectionHeading>Account settings</SectionHeading>
            <form onSubmit={handleProfileSubmit} className="space-y-3">
              {profileStatus.error && <Banner tone="error">{profileStatus.error}</Banner>}
              {profileStatus.success && <Banner tone="success">{profileStatus.success}</Banner>}

              <div className="space-y-1.5">
                <label htmlFor="acc-name" className={labelClass}>
                  Name
                </label>
                <input
                  id="acc-name"
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="acc-email" className={labelClass}>
                  Email
                </label>
                <input
                  id="acc-email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={profileStatus.saving}
                  className="px-4 py-2 rounded-lg bg-ink dark:bg-focus-500 dark:hover:bg-focus-600 text-white text-sm font-medium hover:bg-focus-700 transition disabled:opacity-60"
                >
                  {profileStatus.saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          </section>

          {/* Change password */}
          <section>
            <SectionHeading>Change password</SectionHeading>
            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              {passwordStatus.error && <Banner tone="error">{passwordStatus.error}</Banner>}
              {passwordStatus.success && <Banner tone="success">{passwordStatus.success}</Banner>}

              <div className="space-y-1.5">
                <label htmlFor="acc-current-password" className={labelClass}>
                  Current password
                </label>
                <input
                  id="acc-current-password"
                  type="password"
                  autoComplete="current-password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="acc-new-password" className={labelClass}>
                    New password
                  </label>
                  <input
                    id="acc-new-password"
                    type="password"
                    autoComplete="new-password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="acc-confirm-password" className={labelClass}>
                    Confirm new password
                  </label>
                  <input
                    id="acc-confirm-password"
                    type="password"
                    autoComplete="new-password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={passwordStatus.saving}
                  className="px-4 py-2 rounded-lg bg-ink dark:bg-focus-500 dark:hover:bg-focus-600 text-white text-sm font-medium hover:bg-focus-700 transition disabled:opacity-60"
                >
                  {passwordStatus.saving ? 'Updating…' : 'Update password'}
                </button>
              </div>
            </form>
          </section>

          {/* Sign out */}
          <section className="border-t border-line dark:border-dark-line pt-5">
            <button
              onClick={handleSignOut}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-line dark:border-dark-line text-sm font-medium text-ink dark:text-white px-4 py-2.5 hover:bg-paper dark:hover:bg-dark-line transition"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path
                  d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Sign out
            </button>
          </section>

          {/* Danger zone: delete account */}
          <section className="border-t border-line dark:border-dark-line pt-5">
            <SectionHeading>Danger zone</SectionHeading>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-ember/30 text-sm font-medium text-ember px-4 py-2.5 hover:bg-ember/10 transition"
              >
                Delete account
              </button>
            ) : (
              <div className="space-y-3 rounded-lg border border-ember/30 bg-ember/5 p-4">
                <p className="text-sm text-ink dark:text-white">
                  This will permanently delete your account and all of your tasks and categories.
                  This can't be undone.
                </p>
                {deleteStatus.error && <Banner tone="error">{deleteStatus.error}</Banner>}
                <div className="space-y-1.5">
                  <label htmlFor="acc-delete-password" className={labelClass}>
                    Enter your password to confirm
                  </label>
                  <input
                    id="acc-delete-password"
                    type="password"
                    autoComplete="current-password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-1">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeletePassword('');
                      setDeleteStatus({ error: '', deleting: false });
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-muted dark:text-dark-muted hover:bg-paper dark:hover:bg-dark-line transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteStatus.deleting}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-ember text-white hover:bg-ember/90 transition disabled:opacity-60"
                  >
                    {deleteStatus.deleting ? 'Deleting…' : 'Permanently delete account'}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
