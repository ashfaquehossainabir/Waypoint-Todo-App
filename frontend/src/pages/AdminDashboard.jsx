import { useEffect, useMemo, useState, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import AdminUserEditModal from '../components/AdminUserEditModal';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function RoleBadge({ role }) {
  const isAdmin = role === 'admin';
  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
        isAdmin
          ? 'bg-focus-50 dark:bg-focus-500/10 text-focus-700 dark:text-focus-300'
          : 'bg-line/60 dark:bg-dark-line text-muted dark:text-dark-muted'
      }`}
    >
      {isAdmin ? 'Admin' : 'User'}
    </span>
  );
}

export default function AdminDashboard() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }, [users, search]);

  const stats = useMemo(
    () => ({
      total: users.length,
      admins: users.filter((u) => u.role === 'admin').length,
    }),
    [users]
  );

  const handleSaveUser = async (id, form) => {
    const { data } = await api.put(`/admin/users/${id}`, form);
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data.user } : u)));
    setEditingUser(null);
  };

  const handleDeleteUser = async (targetUser) => {
    setDeleting(true);
    setDeleteError('');
    try {
      await api.delete(`/admin/users/${targetUser.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== targetUser.id));
      setConfirmDelete(null);
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Could not delete user.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper dark:bg-dark-bg transition-colors">
      <Navbar />

      <main className="container-app py-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-semibold text-ink dark:text-white">
              Admin dashboard
            </h1>
            <p className="text-sm text-muted dark:text-dark-muted mt-1">
              Manage every account on Waypoint.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-surface dark:bg-dark-surface border border-line dark:border-dark-line rounded-xl2 shadow-card px-4 py-2.5 text-center">
              <p className="text-lg font-display font-semibold text-ink dark:text-white leading-tight">
                {stats.total}
              </p>
              <p className="text-[11px] uppercase tracking-wide text-muted dark:text-dark-muted">
                Users
              </p>
            </div>
            <div className="bg-surface dark:bg-dark-surface border border-line dark:border-dark-line rounded-xl2 shadow-card px-4 py-2.5 text-center">
              <p className="text-lg font-display font-semibold text-ink dark:text-white leading-tight">
                {stats.admins}
              </p>
              <p className="text-[11px] uppercase tracking-wide text-muted dark:text-dark-muted">
                Admins
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative w-full sm:max-w-xs">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted dark:text-dark-muted"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
              <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full rounded-lg border border-line dark:border-dark-line bg-surface dark:bg-dark-surface pl-9 pr-3.5 py-2.5 text-sm text-ink dark:text-white focus:border-focus-500 focus:ring-1 focus:ring-focus-500 outline-none transition"
            />
          </div>
        </div>

        {error && (
          <div className="text-sm bg-ember/10 text-ember border border-ember/30 rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 rounded-xl2 bg-line/40 dark:bg-dark-line/40 animate-pulse" />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-line dark:border-dark-line rounded-xl2 bg-surface/50 dark:bg-dark-surface/50">
            <p className="font-display text-lg font-semibold text-ink dark:text-white mb-1">
              No users found
            </p>
            <p className="text-sm text-muted dark:text-dark-muted">
              {search ? 'Try a different search term.' : 'No accounts have been created yet.'}
            </p>
          </div>
        ) : (
          <>
            {/* ===== DESKTOP / TABLET TABLE ===== */}
            <div className="hidden md:block bg-surface dark:bg-dark-surface border border-line dark:border-dark-line rounded-xl2 shadow-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line dark:border-dark-line text-left text-xs uppercase tracking-wide text-muted dark:text-dark-muted">
                    <th className="px-5 py-3 font-medium">User</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Role</th>
                    <th className="px-5 py-3 font-medium">Tasks</th>
                    <th className="px-5 py-3 font-medium">Categories</th>
                    <th className="px-5 py-3 font-medium">Joined</th>
                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b last:border-b-0 border-line dark:border-dark-line hover:bg-paper/60 dark:hover:bg-dark-line/40 transition"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="h-8 w-8 shrink-0 rounded-full bg-ink dark:bg-focus-500 text-white font-display font-semibold text-xs flex items-center justify-center">
                            {getInitials(u.name)}
                          </span>
                          <span className="font-medium text-ink dark:text-white truncate">
                            {u.name}
                            {u.id === currentUser?.id && (
                              <span className="text-muted dark:text-dark-muted font-normal"> (you)</span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-muted dark:text-dark-muted">{u.email}</td>
                      <td className="px-5 py-3.5">
                        <RoleBadge role={u.role} />
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-muted dark:text-dark-muted">
                        {u.completedTaskCount}/{u.taskCount}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-muted dark:text-dark-muted">
                        {u.categoryCount}
                      </td>
                      <td className="px-5 py-3.5 text-muted dark:text-dark-muted whitespace-nowrap">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingUser(u)}
                            aria-label={`Edit ${u.name}`}
                            className="p-1.5 rounded text-muted dark:text-dark-muted hover:text-ink dark:hover:text-white hover:bg-paper dark:hover:bg-dark-line transition"
                          >
                            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                              <path
                                d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setDeleteError('');
                              setConfirmDelete(u);
                            }}
                            disabled={u.id === currentUser?.id}
                            aria-label={`Delete ${u.name}`}
                            className="p-1.5 rounded text-muted dark:text-dark-muted hover:text-ember hover:bg-ember/10 transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                          >
                            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                              <path
                                d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ===== MOBILE CARDS ===== */}
            <div className="md:hidden space-y-3">
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className="bg-surface dark:bg-dark-surface border border-line dark:border-dark-line rounded-xl2 shadow-card p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="h-9 w-9 shrink-0 rounded-full bg-ink dark:bg-focus-500 text-white font-display font-semibold text-sm flex items-center justify-center">
                        {getInitials(u.name)}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-ink dark:text-white truncate">
                          {u.name}
                          {u.id === currentUser?.id && (
                            <span className="text-muted dark:text-dark-muted font-normal"> (you)</span>
                          )}
                        </p>
                        <p className="text-xs text-muted dark:text-dark-muted truncate">{u.email}</p>
                      </div>
                    </div>
                    <RoleBadge role={u.role} />
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3.5 border-t border-line dark:border-dark-line text-center">
                    <div>
                      <p className="text-sm font-mono font-medium text-ink dark:text-white">
                        {u.completedTaskCount}/{u.taskCount}
                      </p>
                      <p className="text-[11px] uppercase tracking-wide text-muted dark:text-dark-muted">
                        Tasks
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-mono font-medium text-ink dark:text-white">
                        {u.categoryCount}
                      </p>
                      <p className="text-[11px] uppercase tracking-wide text-muted dark:text-dark-muted">
                        Categories
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-mono font-medium text-ink dark:text-white">
                        {formatDate(u.createdAt)}
                      </p>
                      <p className="text-[11px] uppercase tracking-wide text-muted dark:text-dark-muted">
                        Joined
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3.5 pt-3.5 border-t border-line dark:border-dark-line">
                    <button
                      onClick={() => setEditingUser(u)}
                      className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-ink dark:text-white border border-line dark:border-dark-line hover:bg-paper dark:hover:bg-dark-line transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeleteError('');
                        setConfirmDelete(u);
                      }}
                      disabled={u.id === currentUser?.id}
                      className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-ember border border-ember/30 hover:bg-ember/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <AdminUserEditModal
        user={editingUser}
        currentAdminId={currentUser?.id}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveUser}
      />

      {confirmDelete && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4"
          onClick={() => !deleting && setConfirmDelete(null)}
        >
          <div
            className="w-full max-w-sm bg-surface dark:bg-dark-surface rounded-xl2 shadow-modal p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-lg font-semibold text-ink dark:text-white mb-2">
              Delete {confirmDelete.name}?
            </h3>
            <p className="text-sm text-muted dark:text-dark-muted mb-5">
              This permanently deletes their account along with all of their tasks and categories.
              This can't be undone.
            </p>
            {deleteError && (
              <div className="text-sm bg-ember/10 text-ember border border-ember/30 rounded-lg px-3 py-2 mb-4">
                {deleteError}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted dark:text-dark-muted hover:bg-paper dark:hover:bg-dark-line transition disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(confirmDelete)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-ember text-white hover:bg-ember/90 transition disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
