import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import ErrorBox from '../components/ErrorBox';
import useAuth from '../hooks/useAuth';
import getErrorMessage from '../utils/getErrorMessage';

export default function LoginPage() {
  const { token, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const notice = location.state?.message;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already signed in? The dashboard is the only place to be.
  if (token) return <Navigate to="/" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <main className="card auth-card">
        <div className="auth-brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3Z" />
            </svg>
          </span>
          <span className="auth-brand-copy">
            Sweety
            <span>Patient portal</span>
          </span>
        </div>
        <h1>Welcome back</h1>
        <p className="auth-subtitle">Sign in to review your blood glucose readings.</p>

        {notice && (
          <p className="notice" role="status">
            {notice}
          </p>
        )}
        <ErrorBox message={error} />

        <form className="stack" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button type="submit" className="button button-full" disabled={loading}>
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="auth-switch">
          New to Sweety? <Link to="/register">Create an account</Link>
        </p>
      </main>
    </div>
  );
}
