import { useEffect, useState } from 'react';

const inputClass =
  'w-full rounded-lg border border-line dark:border-dark-line bg-paper/60 dark:bg-dark-bg px-3.5 py-2.5 text-sm text-ink dark:text-white focus:border-focus-500 focus:ring-1 focus:ring-focus-500 outline-none transition';
const labelClass = 'text-sm font-medium text-ink/80 dark:text-white/80';

export default function AdminUserEditModal({ user, currentAdminId, onClose, onSave }) {
  const [form, setForm] = useState({ name: '', email: '', role: 'user' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '', role: user.role || 'user' });
      setError('');
    }
  }, [user]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!user) return null;

  const isSelf = user.id === currentAdminId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onSave(user.id, form);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/40 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-surface dark:bg-dark-surface rounded-t-2xl sm:rounded-xl2 shadow-modal max-h-[92vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Edit user"
      >
        <div className="sticky top-0 z-10 bg-surface dark:bg-dark-surface border-b border-line dark:border-dark-line px-5 sm:px-6 py-4 flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wide text-muted dark:text-dark-muted">
            Edit user
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
          {error && (
            <div className="text-sm bg-ember/10 text-ember border border-ember/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="edit-name" className={labelClass}>
              Name
            </label>
            <input
              id="edit-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="edit-email" className={labelClass}>
              Email
            </label>
            <input
              id="edit-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="edit-role" className={labelClass}>
              Role
            </label>
            <select
              id="edit-role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              disabled={isSelf}
              className={`${inputClass} disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {isSelf && (
              <p className="text-xs text-muted dark:text-dark-muted">
                You can't change your own role.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted dark:text-dark-muted hover:bg-paper dark:hover:bg-dark-line transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-ink dark:bg-focus-500 dark:hover:bg-focus-600 text-white text-sm font-medium hover:bg-focus-700 transition disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
