import { useState } from 'react';

const inputClass =
  'w-full rounded-lg border border-line dark:border-dark-line bg-paper/60 dark:bg-dark-bg px-3.5 py-2.5 text-sm text-ink dark:text-white focus:border-focus-500 focus:ring-1 focus:ring-focus-500 outline-none transition';
const labelClass = 'text-sm font-medium text-ink/80 dark:text-white/80';

export default function TaskForm({ initial, categories = [], onSubmit, onCancel, submitLabel = 'Save task' }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    priority: initial?.priority || 'medium',
    dueDate: initial?.dueDate ? initial.dueDate.slice(0, 10) : '',
    category: initial?.category?._id || initial?.category || '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Give the task a title.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        dueDate: form.dueDate || null,
        category: form.category || null,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the task.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-sm bg-ember/10 text-ember border border-ember/30 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          autoFocus
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Prepare quarterly report"
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className={labelClass}>
          Details
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
          placeholder="Add any notes for this task…"
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="priority" className={labelClass}>
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="dueDate" className={labelClass}>
            Due date
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="category" className={labelClass}>
          Category
        </label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">No category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm font-medium text-muted dark:text-dark-muted hover:bg-paper dark:hover:bg-dark-line transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-ink dark:bg-focus-500 dark:hover:bg-focus-600 text-white text-sm font-medium hover:bg-focus-700 transition disabled:opacity-60"
        >
          {saving ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
