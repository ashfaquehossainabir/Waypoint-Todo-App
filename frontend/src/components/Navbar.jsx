import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ConfirmLogoutModal from "../components/ConfirmLogoutModal";

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/categories', label: 'Categories' },
];

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="relative h-9 w-9 rounded-lg flex items-center justify-center text-muted dark:text-dark-muted hover:bg-paper dark:hover:bg-dark-line transition"
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path
            d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive
        ? 'bg-ink text-white dark:bg-focus-500'
        : 'text-muted dark:text-dark-muted hover:text-ink dark:hover:text-white hover:bg-paper dark:hover:bg-dark-line'
    }`;

  return (
    <>
      <header className="sticky top-0 z-30 bg-paper/90 dark:bg-dark-bg/90 backdrop-blur border-b border-line dark:border-dark-line">
        <div className="container-app py-3 sm:py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <NavLink to="/dashboard" className="flex items-center gap-2 shrink-0">
              <span className="h-8 w-8 rounded-lg bg-ink dark:bg-focus-200 flex items-center justify-center">
                <svg className="h-4 w-4 rounded-sm bg-focus-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                  <path d="M197.8 100.3C208.7 107.9 211.3 122.9 203.7 133.7L147.7 213.7C143.6 219.5 137.2 223.2 130.1 223.8C123 224.4 116 222 111 217L71 177C61.7 167.6 61.7 152.4 71 143C80.3 133.6 95.6 133.7 105 143L124.8 162.8L164.4 106.2C172 95.3 187 92.7 197.8 100.3zM197.8 260.3C208.7 267.9 211.3 282.9 203.7 293.7L147.7 373.7C143.6 379.5 137.2 383.2 130.1 383.8C123 384.4 116 382 111 377L71 337C61.6 327.6 61.6 312.4 71 303.1C80.4 293.8 95.6 293.7 104.9 303.1L124.7 322.9L164.3 266.3C171.9 255.4 186.9 252.8 197.7 260.4zM288 160C288 142.3 302.3 128 320 128L544 128C561.7 128 576 142.3 576 160C576 177.7 561.7 192 544 192L320 192C302.3 192 288 177.7 288 160zM288 320C288 302.3 302.3 288 320 288L544 288C561.7 288 576 302.3 576 320C576 337.7 561.7 352 544 352L320 352C302.3 352 288 337.7 288 320zM224 480C224 462.3 238.3 448 256 448L544 448C561.7 448 576 462.3 576 480C576 497.7 561.7 512 544 512L256 512C238.3 512 224 497.7 224 480zM128 440C150.1 440 168 457.9 168 480C168 502.1 150.1 520 128 520C105.9 520 88 502.1 88 480C88 457.9 105.9 440 128 440z"/>
                </svg>
              </span>
              <span className="font-display text-lg font-semibold tracking-tight hidden xs:inline">
                Waypoint
              </span>
            </NavLink>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.to} to={link.to} className={linkClass}>
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <div className="text-right">
              <p className="text-sm font-medium leading-tight">{user?.name}</p>
              <p className="text-xs text-muted dark:text-dark-muted leading-tight">{user?.email}</p>
            </div>
            <button
              onClick={() => setShowLogout(true)}
              className="text-sm font-medium text-muted dark:text-dark-muted hover:text-ember transition px-3 py-1.5 rounded-lg hover:bg-ember/10"
            >
              Sign out
            </button>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="h-9 w-9 rounded-lg flex items-center justify-center text-ink dark:text-white hover:bg-paper dark:hover:bg-dark-line transition"
            >
              {open ? (
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden fixed top-[64px] left-0 right-0 z-40 border-t border-line dark:border-dark-line bg-paper dark:bg-dark-bg shadow-lg">
            <div className="container-app py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? 'bg-ink text-white dark:bg-focus-500'
                        : 'text-muted dark:text-dark-muted hover:bg-line/50 dark:hover:bg-dark-line'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <div className="flex items-center justify-between px-3 py-3 mt-1 border-t border-line dark:border-dark-line">
                <div>
                  <p className="text-sm font-medium leading-tight">{user?.name}</p>
                  <p className="text-xs text-muted dark:text-dark-muted leading-tight">{user?.email}</p>
                </div>
                <button
                  onClick={() => setShowLogout(true)}
                  className="text-sm font-medium text-ember px-3 py-1.5 rounded-lg hover:bg-ember/10 transition"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <ConfirmLogoutModal
        open={showLogout}
        onCancel={() => setShowLogout(false)}
        onConfirm={() => {
          setShowLogout(false);
          logout();
        }}
      />
    </>
  );
}
