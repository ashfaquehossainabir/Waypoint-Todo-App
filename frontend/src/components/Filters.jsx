const TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
];

export default function Filters({ active, onChange, counts }) {
  return (
    <div className="inline-flex rounded-lg border border-line dark:border-dark-line bg-surface dark:bg-dark-surface p-1 gap-1">
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition flex items-center gap-1.5 ${
              isActive
                ? 'bg-ink dark:bg-focus-500 text-white'
                : 'text-muted dark:text-dark-muted hover:text-ink dark:hover:text-white hover:bg-paper dark:hover:bg-dark-line'
            }`}
          >
            {tab.label}
            <span
              className={`font-mono text-[11px] px-1.5 py-0.5 rounded ${
                isActive ? 'bg-white/15' : 'bg-paper dark:bg-dark-line text-muted dark:text-dark-muted'
              }`}
            >
              {counts[tab.key] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
