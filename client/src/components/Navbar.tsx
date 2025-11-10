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
        <span style={{
          background: 'linear-gradient(to bottom, #000 33%, #DD0000 33%, #DD0000 66%, #FFCE00 66%)',
          color: 'white',
          padding: '0.15rem 0.4rem',
          borderRadius: '3px',
          marginRight: '0.5rem',
          fontWeight: 'bold',
          fontSize: '0.85em',
          display: 'inline-block'
        }}>DE</span>
        VerbMeister
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
