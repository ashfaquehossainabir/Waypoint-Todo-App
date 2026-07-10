import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const SWATCHES = ['#0E7C6F', '#E0663E', '#D9A441', '#5B6EE1', '#B15BC7', '#3E9AE0'];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [color, setColor] = useState(SWATCHES[0]);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/categories');
      setCategories(data.categories);
    } catch (err) {
      setError('Could not load categories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError('');
    try {
      const { data } = await api.post('/categories', { name, color });
      setCategories((prev) => [...prev, { ...data.category, taskCount: 0, completedCount: 0 }].sort((a, b) => a.name.localeCompare(b.name)));
      setName('');
      setColor(SWATCHES[0]);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create category.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setEditName(cat.name);
    setEditColor(cat.color);
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;
    try {
      const { data } = await api.put(`/categories/${id}`, { name: editName, color: editColor });
      setCategories((prev) =>
        prev.map((c) => (c._id === id ? { ...c, ...data.category } : c))
      );
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update category.');
    }
  };

  const handleDelete = async (cat) => {
    try {
      await api.delete(`/categories/${cat._id}`);
      setCategories((prev) => prev.filter((c) => c._id !== cat._id));
      setConfirmDelete(null);
    } catch (err) {
      setError('Could not delete category.');
    }
  };

  return (
    <div className="min-h-screen bg-paper dark:bg-dark-bg transition-colors">
      <Navbar />

      <main className="container-app py-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold text-ink dark:text-white">Categories</h1>
          <p className="text-sm text-muted dark:text-dark-muted mt-1">
            Group your tasks so they're easier to scan and filter.
          </p>
        </div>

        <form
          onSubmit={handleCreate}
          className="bg-surface dark:bg-dark-surface border border-line dark:border-dark-line rounded-xl2 shadow-card p-5 sm:p-6 mb-8"
        >
          <h2 className="font-display text-base font-semibold text-ink dark:text-white mb-4">
            New category
          </h2>

          {error && (
            <div className="text-sm bg-ember/10 text-ember border border-ember/30 rounded-lg px-3 py-2 mb-4">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex-1 space-y-1.5">
              <label htmlFor="catName" className="text-sm font-medium text-ink/80 dark:text-white/80">
                Name
              </label>
              <input
                id="catName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Work, Personal, Errands"
                className="w-full rounded-lg border border-line dark:border-dark-line bg-paper/60 dark:bg-dark-bg px-3.5 py-2.5 text-sm text-ink dark:text-white focus:border-focus-500 focus:ring-1 focus:ring-focus-500 outline-none transition"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-sm font-medium text-ink/80 dark:text-white/80 block">Color</span>
              <div className="flex items-center gap-2">
                {SWATCHES.map((sw) => (
                  <button
                    type="button"
                    key={sw}
                    onClick={() => setColor(sw)}
                    aria-label={`Choose color ${sw}`}
                    className={`h-8 w-8 rounded-full border-2 transition ${
                      color === sw ? 'border-ink dark:border-white scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: sw }}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="rounded-lg bg-ink dark:bg-focus-500 text-white text-sm font-medium px-5 py-2.5 hover:bg-focus-700 transition disabled:opacity-60 whitespace-nowrap"
            >
              {saving ? 'Adding…' : 'Add category'}
            </button>
          </div>
        </form>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 rounded-xl2 bg-line/40 dark:bg-dark-line/40 animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-line dark:border-dark-line rounded-xl2 bg-surface/50 dark:bg-dark-surface/50">
            <p className="font-display text-lg font-semibold text-ink dark:text-white mb-1">
              No categories yet
            </p>
            <p className="text-sm text-muted dark:text-dark-muted">
              Add one above to start organizing your tasks.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="bg-surface dark:bg-dark-surface border border-line dark:border-dark-line rounded-xl2 shadow-card p-4 sm:p-5"
              >
                {editingId === cat._id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full rounded-lg border border-line dark:border-dark-line bg-paper/60 dark:bg-dark-bg px-3 py-2 text-sm text-ink dark:text-white focus:border-focus-500 focus:ring-1 focus:ring-focus-500 outline-none"
                    />
                    <div className="flex items-center gap-2">
                      {SWATCHES.map((sw) => (
                        <button
                          key={sw}
                          onClick={() => setEditColor(sw)}
                          aria-label={`Choose color ${sw}`}
                          className={`h-6 w-6 rounded-full border-2 transition ${
                            editColor === sw ? 'border-ink dark:border-white scale-110' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: sw }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted dark:text-dark-muted hover:bg-paper dark:hover:bg-dark-line transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdate(cat._id)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-ink dark:bg-focus-500 text-white hover:bg-focus-700 transition"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="h-3 w-3 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <h3 className="font-display font-semibold text-ink dark:text-white truncate">
                          {cat.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => startEdit(cat)}
                          aria-label="Edit category"
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
                          onClick={() => setConfirmDelete(cat)}
                          aria-label="Delete category"
                          className="p-1.5 rounded text-muted dark:text-dark-muted hover:text-ember hover:bg-ember/10 transition"
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
                    </div>
                    <p className="text-xs font-mono text-muted dark:text-dark-muted mt-3">
                      {cat.completedCount}/{cat.taskCount} task{cat.taskCount === 1 ? '' : 's'} completed
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {confirmDelete && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="w-full max-w-sm bg-surface dark:bg-dark-surface rounded-xl2 shadow-modal p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-lg font-semibold text-ink dark:text-white mb-2">
              Delete "{confirmDelete.name}"?
            </h3>
            <p className="text-sm text-muted dark:text-dark-muted mb-5">
              Tasks in this category will be kept, but no longer grouped under it.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted dark:text-dark-muted hover:bg-paper dark:hover:bg-dark-line transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-ember text-white hover:bg-ember/90 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
