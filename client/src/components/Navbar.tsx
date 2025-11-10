import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore.ts';

export default function Navbar() {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const logout = useAppStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        🇩🇪 VerbMeister
      </Link>
      <div className="navbar-nav">
        {isAuthenticated && (
          <>
            <span>Bonjour{user?.firstName ? `, ${user.firstName}` : ''} !</span>
            <button
              className="btn-link"
              onClick={handleLogout}
              style={{ marginLeft: '1rem' }}
            >
              Déconnexion
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
