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
        Sweety
        <span className="brand-tagline">blood glucose tracker</span>
      </Link>

      <div className="header-user">
        {user?.name && <span className="greeting">Hi, {user.name}</span>}
        <button type="button" className="button button-ghost" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
