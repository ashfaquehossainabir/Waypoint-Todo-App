import { useEffect, useState } from 'react';
import TaskForm from './TaskForm';

const PRIORITY_STYLES = {
  high: 'text-ember bg-ember/10',
  medium: 'text-gold bg-gold/10',
  low: 'text-focus-600 dark:text-focus-300 bg-focus-50 dark:bg-focus-500/10',
};

function formatDateFull(dateStr) {
  if (!dateStr) return 'No due date';
  return new Date(dateStr).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function TaskModal({
  task,
  categories = [],
  onClose,
  onUpdate,
  onDelete,
  onToggle,
}) {
  const [mode, setMode] = useState('view');

  useEffect(() => {
    setMode('view');
  }, [task]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!task) return null;

  const handleUpdate = async (data) => {
    await onUpdate(task._id, data);
    setMode('view');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm px-3 sm:px-4"
      onClick={onClose}
    >
      {/* ===== MODAL ===== */}
      <div
        className="
          w-full max-w-lg
          bg-surface dark:bg-dark-surface
          rounded-xl
          shadow-modal
          max-h-[90vh]
          overflow-y-auto
          scrollbar-thin
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===== HEADER ===== */}
        <div className="sticky top-0 bg-surface dark:bg-dark-surface border-b border-line dark:border-dark-line px-5 sm:px-6 py-4 flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wide text-muted dark:text-dark-muted">
            {mode === 'edit' ? 'Edit task' : 'Task details'}
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

        {/* ===== BODY ===== */}
        <div className="p-5 sm:p-6">
          {mode === 'edit' ? (
            <TaskForm
              initial={task}
              categories={categories}
              submitLabel="Save changes"
              onCancel={() => setMode('view')}
              onSubmit={handleUpdate}
            />
          ) : (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <h2
                  className={`font-display text-xl font-semibold break-words ${
                    task.completed
                      ? 'line-through text-muted dark:text-dark-muted'
                      : 'text-ink dark:text-white'
                  }`}
                >
                  {task.title}
                </h2>

                <span
                  className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                    PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium
                  }`}
                >
                  {task.priority}
                </span>
              </div>

              {task.category && (
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: `${task.category.color}1A`,
                    color: task.category.color,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: task.category.color }}
                  />
                  {task.category.name}
                </span>
              )}

              <div className="flex items-center gap-2 text-sm">
                <span
                  className={`h-2 w-2 rounded-full ${
                    task.completed ? 'bg-focus-500' : 'bg-gold'
                  }`}
                />
                <span className="text-muted dark:text-dark-muted">
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
                <span className="text-line dark:text-dark-line">•</span>
                <span className="font-mono text-muted dark:text-dark-muted text-xs">
                  {formatDateFull(task.dueDate)}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-medium uppercase tracking-wide text-muted dark:text-dark-muted mb-1.5">
                  Details
                </h3>
                <p className="text-sm text-ink/85 dark:text-white/85 whitespace-pre-wrap break-words">
                  {task.description ||
                    'No additional details were added for this task.'}
                </p>
              </div>

              <div className="text-xs text-muted dark:text-dark-muted font-mono border-t border-line dark:border-dark-line pt-3">
                Created {new Date(task.createdAt).toLocaleString()}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => onToggle(task)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    task.completed
                      ? 'bg-paper dark:bg-dark-line text-ink dark:text-white hover:bg-line dark:hover:bg-dark-line/70'
                      : 'bg-focus-500 text-white hover:bg-focus-600'
                  }`}
                >
                  {task.completed
                    ? 'Mark as pending'
                    : 'Mark as completed'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMode('edit')}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-ink dark:text-white hover:bg-paper dark:hover:bg-dark-line transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(task)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-ember hover:bg-ember/10 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}