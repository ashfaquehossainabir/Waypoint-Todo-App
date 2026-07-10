const PRIORITY_STYLES = {
  high: { bar: 'bg-ember', label: 'High', text: 'text-ember' },
  medium: { bar: 'bg-gold', label: 'Medium', text: 'text-gold' },
  low: { bar: 'bg-focus-500', label: 'Low', text: 'text-focus-600 dark:text-focus-300' },
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function TaskCard({ task, onOpen, onToggle, onDelete }) {
  const priority = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;
  const due = formatDate(task.dueDate);

  return (
    <div
      className={`group relative flex overflow-hidden rounded-xl2 border border-line dark:border-dark-line bg-surface dark:bg-dark-surface shadow-card transition hover:-translate-y-0.5 hover:shadow-lg cursor-pointer ${
        task.completed ? 'opacity-70' : ''
      }`}
      onClick={() => onOpen(task)}
    >
      <div className={`w-1.5 shrink-0 ${priority.bar}`} />
      <div className="flex-1 p-4 sm:p-5 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3
            className={`font-display font-semibold text-ink dark:text-white text-base leading-snug break-words ${
              task.completed ? 'line-through text-muted dark:text-dark-muted' : ''
            }`}
          >
            {task.title}
          </h3>

          <button
            aria-label={task.completed ? 'Mark as pending' : 'Mark as completed'}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(task);
            }}
            className={`shrink-0 h-7 w-7 rounded-full border-2 flex items-center justify-center transition ${
              task.completed
                ? 'bg-focus-500 border-focus-500 text-white'
                : 'border-line dark:border-dark-line text-transparent hover:border-focus-500'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {task.description && (
          <p className="mt-1.5 text-sm text-muted dark:text-dark-muted line-clamp-2 break-words">
            {task.description}
          </p>
        )}

        {task.category && (
          <span
            className="inline-flex items-center gap-1.5 mt-2.5 text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${task.category.color}1A`,
              color: task.category.color,
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: task.category.color }} />
            {task.category.name}
          </span>
        )}

        <div className="mt-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className={`font-medium ${priority.text}`}>{priority.label}</span>
            {due && <span className="font-mono text-muted dark:text-dark-muted">Due {due}</span>}
          </div>

          <button
            aria-label="Delete task"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task);
            }}
            className="opacity-0 group-hover:opacity-100 text-muted dark:text-dark-muted hover:text-ember transition p-1 rounded"
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
    </div>
  );
}
