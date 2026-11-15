import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import ErrorBox from '../components/ErrorBox';
import useAuth from '../hooks/useAuth';
import getErrorMessage from '../utils/getErrorMessage';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegisterForm({ name, email, password }) {
  if (name.length < 2) return 'Please enter your name (at least 2 characters).';
  if (!EMAIL_PATTERN.test(email)) return 'Please enter a valid email address.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  return '';
}

export default function RegisterPage() {
  const { token, register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (token) return <Navigate to="/" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const clientError = validateRegisterForm({ name: cleanName, email: cleanEmail, password });

    if (clientError) {
      setError(clientError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(cleanName, cleanEmail, password);
      navigate('/login', {
        replace: true,
        state: { message: 'Account created, please log in' },
      });
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
        <h1>Create your account</h1>
        <p className="auth-subtitle">Create an account to keep your glucose readings organized.</p>

        <ErrorBox message={error} />

        <form className="stack" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="register-name">Name</label>
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <small className="field-help">At least 8 characters.</small>
          </div>

          <button type="submit" className="button button-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </main>
    </div>
  );
}
