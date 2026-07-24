import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

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

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not sign in. Check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper dark:bg-dark-bg px-4 py-10 transition-colors">
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-9 w-9 rounded-lg bg-ink flex items-center justify-center">
              <svg className="h-4 w-4 rounded-sm bg-focus-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <path d="M197.8 100.3C208.7 107.9 211.3 122.9 203.7 133.7L147.7 213.7C143.6 219.5 137.2 223.2 130.1 223.8C123 224.4 116 222 111 217L71 177C61.7 167.6 61.7 152.4 71 143C80.3 133.6 95.6 133.7 105 143L124.8 162.8L164.4 106.2C172 95.3 187 92.7 197.8 100.3zM197.8 260.3C208.7 267.9 211.3 282.9 203.7 293.7L147.7 373.7C143.6 379.5 137.2 383.2 130.1 383.8C123 384.4 116 382 111 377L71 337C61.6 327.6 61.6 312.4 71 303.1C80.4 293.8 95.6 293.7 104.9 303.1L124.7 322.9L164.3 266.3C171.9 255.4 186.9 252.8 197.7 260.4zM288 160C288 142.3 302.3 128 320 128L544 128C561.7 128 576 142.3 576 160C576 177.7 561.7 192 544 192L320 192C302.3 192 288 177.7 288 160zM288 320C288 302.3 302.3 288 320 288L544 288C561.7 288 576 302.3 576 320C576 337.7 561.7 352 544 352L320 352C302.3 352 288 337.7 288 320zM224 480C224 462.3 238.3 448 256 448L544 448C561.7 448 576 462.3 576 480C576 497.7 561.7 512 544 512L256 512C238.3 512 224 497.7 224 480zM128 440C150.1 440 168 457.9 168 480C168 502.1 150.1 520 128 520C105.9 520 88 502.1 88 480C88 457.9 105.9 440 128 440z"/>
              </svg>
            </span>
            <span className="font-display text-xl font-semibold tracking-tight text-ink dark:text-white">Waypoint</span>
          </div>
          <p className="text-muted dark:text-dark-muted text-sm">Sign in to get back to your tasks.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface dark:bg-dark-surface border border-line dark:border-dark-line rounded-xl2 shadow-card p-6 sm:p-8 space-y-5"
        >
          <h1 className="text-2xl font-semibold text-ink dark:text-white">Welcome back</h1>

          {error && (
            <div className="text-sm bg-ember/10 text-ember border border-ember/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-ink/80 dark:text-white/80">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="w-full rounded-lg border border-line dark:border-dark-line bg-paper/60 dark:bg-dark-bg px-3.5 py-2.5 text-sm text-ink dark:text-white focus:border-focus-500 focus:ring-1 focus:ring-focus-500 outline-none transition"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-ink/80 dark:text-white/80">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-line dark:border-dark-line bg-paper/60 dark:bg-dark-bg px-3.5 py-2.5 text-sm text-ink dark:text-white focus:border-focus-500 focus:ring-1 focus:ring-focus-500 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-ink dark:bg-focus-500 text-white font-medium text-sm py-2.5 hover:bg-focus-700 transition disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="text-sm text-center text-muted dark:text-dark-muted">
            New here?{' '}
            <Link to="/register" className="text-focus-600 dark:text-focus-300 font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
