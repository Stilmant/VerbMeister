import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export default function Navbar() {
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        🇩🇪 VerbMeister
      </Link>
      <div className="navbar-nav">
        {user && (
          <>
            <span>Bonjour, {user.firstName} !</span>
            <button
              className="btn-link"
              onClick={logout}
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
