export default function ProgressDial({ total, completed }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-16 w-16 shrink-0">
        <svg viewBox="0 0 70 70" className="h-16 w-16 -rotate-90">
          <circle
            cx="35"
            cy="35"
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-line dark:text-dark-line"
            strokeWidth="6"
          />
          <circle
            cx="35"
            cy="35"
            r={radius}
            fill="none"
            stroke="#0E7C6F"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-sm font-medium text-ink dark:text-white">{pct}%</span>
        </div>
      </div>
      <div>
        <p className="font-display text-sm font-semibold text-ink dark:text-white">Today's momentum</p>
        <p className="text-xs text-muted dark:text-dark-muted mt-0.5">
          {completed} of {total} task{total === 1 ? '' : 's'} done
        </p>
      </div>
    </div>
  );
}
