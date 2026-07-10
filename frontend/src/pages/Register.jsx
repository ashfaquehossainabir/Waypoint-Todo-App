import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper dark:bg-dark-bg px-4 py-10 transition-colors">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-9 w-9 rounded-lg bg-ink flex items-center justify-center">
              <span className="h-2.5 w-2.5 rounded-full bg-focus-300" />
            </span>
            <span className="font-display text-xl font-semibold tracking-tight text-ink dark:text-white">Waypoint</span>
          </div>
          <p className="text-muted dark:text-dark-muted text-sm">Create an account to start organizing your day.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface dark:bg-dark-surface border border-line dark:border-dark-line rounded-xl2 shadow-card p-6 sm:p-8 space-y-5"
        >
          <h1 className="text-2xl font-semibold text-ink dark:text-white">Create your account</h1>

          {error && (
            <div className="text-sm bg-ember/10 text-ember border border-ember/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-ink/80 dark:text-white/80">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Jordan Lee"
              className="w-full rounded-lg border border-line dark:border-dark-line bg-paper/60 dark:bg-dark-bg px-3.5 py-2.5 text-sm text-ink dark:text-white focus:border-focus-500 focus:ring-1 focus:ring-focus-500 outline-none transition"
            />
          </div>

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
              placeholder="you@example.com"
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
              minLength={6}
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className="w-full rounded-lg border border-line dark:border-dark-line bg-paper/60 dark:bg-dark-bg px-3.5 py-2.5 text-sm text-ink dark:text-white focus:border-focus-500 focus:ring-1 focus:ring-focus-500 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-ink dark:bg-focus-500 text-white font-medium text-sm py-2.5 hover:bg-focus-700 transition disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>

          <p className="text-sm text-center text-muted dark:text-dark-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-focus-600 dark:text-focus-300 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
