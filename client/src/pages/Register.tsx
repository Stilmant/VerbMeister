import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export default function Register() {
  const navigate = useNavigate();
  const setUser = useAppStore((state) => state.setUser);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation côté client
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      // Enregistrer l'utilisateur et le token
      setUser(data.user, data.token);

      // Rediriger vers le tableau de bord
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
        <h1>🇩🇪 Bienvenue sur VerbMeister</h1>
        <p>Apprends les verbes irréguliers allemands de manière ludique et efficace !</p>
      </div>

      <div className="card">
        <h2>Créer ton compte</h2>

        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Prénom
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="Marie"
              required
              autoFocus
            />
          </label>

          <label>
            Nom
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Dupont"
              required
            />
          </label>

          <label>
            Adresse email
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="marie@exemple.lu"
              required
            />
          </label>

          <label>
            Mot de passe
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Au moins 6 caractères"
              required
            />
            <small>Minimum 6 caractères</small>
          </label>

          <label>
            Confirmer le mot de passe
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Retape ton mot de passe"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Inscription en cours...' : 'Créer mon compte'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Tu as déjà un compte ?{' '}
          <Link to="/login">Connecte-toi ici</Link>
        </p>
      </div>
    </main>
  );
}
