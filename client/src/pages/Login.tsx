import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore.ts';

export default function Login() {
  const navigate = useNavigate();
  const setUser = useAppStore((state) => state.setUser);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la connexion');
      }

      setUser(data.user, data.token);
      navigate('/dashboard');

    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <div className="hero">
        <h1>🇩🇪 VerbMeister</h1>
        <p>Connecte-toi pour continuer ton apprentissage</p>
      </div>

      <div className="card">
        <h2>Connexion</h2>

        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Adresse email
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="ton-email@exemple.lu"
              required
              autoFocus
            />
          </label>

          <label>
            Mot de passe
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Ton mot de passe"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Pas encore de compte ?{' '}
          <Link to="/register">Inscris-toi ici</Link>
        </p>
      </div>
    </main>
  );
}
