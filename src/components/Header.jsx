import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="app-header">
      <Link to="/" className="brand">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3Z" />
          </svg>
        </span>
        <span className="brand-copy">
          Sweety
          <span className="brand-tagline">blood glucose tracker</span>
        </span>
      </Link>

      <div className="header-user">
        {user?.name && (
          <div className="user-profile">
            <span className="user-avatar" aria-hidden="true">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <span className="greeting">Hi, {user.name}</span>
          </div>
        )}
        <button type="button" className="button button-ghost" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
