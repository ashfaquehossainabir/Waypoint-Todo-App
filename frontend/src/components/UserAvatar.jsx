function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function UserAvatar({ name, onClick, size = 'md' }) {
  const dimensions = size === 'sm' ? 'h-8 w-8 text-xs' : 'h-9 w-9 text-sm';

  return (
    <button
      onClick={onClick}
      aria-label="Open account settings"
      className={`${dimensions} shrink-0 rounded-full bg-ink dark:bg-focus-500 text-white font-display font-semibold flex items-center justify-center ring-2 ring-transparent hover:ring-focus-300 dark:hover:ring-focus-300/60 focus-visible:ring-focus-300 transition`}
    >
      {getInitials(name)}
    </button>
  );
}
