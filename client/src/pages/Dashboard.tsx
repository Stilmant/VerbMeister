import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore.ts';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const verbs = useAppStore((state) => state.verbs);
  const setVerbs = useAppStore((state) => state.setVerbs);
  const token = useAppStore((state) => state.token);
  const logout = useAppStore((state) => state.logout);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVerb, setSelectedVerb] = useState<any>(null);

  useEffect(() => {
    // Vérifier que l'utilisateur a bien toutes ses informations
    if (token && !user) {
      // Token présent mais pas d'info utilisateur = état corrompu
      console.log('État d\'authentification corrompu, nettoyage...');
      logout();
      navigate('/login');
      return;
    }
    loadVerbs();
  }, []);

  const loadVerbs = async () => {
    try {
      const response = await fetch('/api/verbs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des verbes');
      }

      const data = await response.json();
      setVerbs(data);

      // Sélectionner le premier verbe par défaut
      if (data.length > 0 && !selectedVerb) {
        setSelectedVerb(data[0]);
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="container">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p aria-busy="true">Chargement...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container" style={{ marginTop: '2rem' }}>
      <div className="hero" style={{ padding: '2rem 1rem' }}>
        <h1>Bonjour {user?.firstName} ! 👋</h1>
        <p>Prêt(e) à apprendre les verbes irréguliers allemands ?</p>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {verbs.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center' }}>
            Aucun verbe disponible pour le moment.
          </p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '2rem' }}>
            <h2>Groupe L - {verbs.length} verbes à apprendre</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {verbs.map((verb) => (
                <button
                  key={verb.id}
                  onClick={() => setSelectedVerb(verb)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: selectedVerb?.id === verb.id
                      ? '2px solid var(--primary)'
                      : '1px solid var(--muted-border-color)',
                    borderRadius: '4px',
                    background: selectedVerb?.id === verb.id
                      ? 'var(--primary)'
                      : 'transparent',
                    color: selectedVerb?.id === verb.id
                      ? 'white'
                      : 'inherit',
                    cursor: 'pointer'
                  }}
                >
                  {verb.infinitiv}
                </button>
              ))}
            </div>
          </div>

          {selectedVerb && (
            <div className="verb-card">
              <h2 style={{ marginTop: 0 }}>
                {selectedVerb.infinitiv}
                <span style={{
                  marginLeft: '1rem',
                  fontSize: '1.2rem',
                  color: 'var(--muted-color)'
                }}>
                  ({selectedVerb.translation_fr})
                </span>
              </h2>

              <div className="verb-forms">
                <div className="verb-form">
                  <strong>Infinitiv</strong>
                  <div>{selectedVerb.infinitiv}</div>
                </div>

                <div className="verb-form">
                  <strong>Präteritum (3. P sg)</strong>
                  <div>{selectedVerb.praeteritum}</div>
                </div>

                <div className="verb-form">
                  <strong>Partizip II</strong>
                  <div>{selectedVerb.partizip_ii}</div>
                </div>

                <div className="verb-form">
                  <strong>Hilfsverb</strong>
                  <div style={{
                    color: selectedVerb.hilfsverb === 'sein'
                      ? 'var(--primary)'
                      : 'var(--success)'
                  }}>
                    {selectedVerb.hilfsverb}
                  </div>
                </div>
              </div>

              {selectedVerb.sonderformen_praesens &&
               selectedVerb.sonderformen_praesens.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <strong>Sonderformen Präsens :</strong>
                  <div style={{ marginTop: '0.5rem' }}>
                    {selectedVerb.sonderformen_praesens.map((form: string, idx: number) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          background: 'var(--code-background-color)',
                          borderRadius: '4px',
                          marginRight: '0.5rem',
                          marginBottom: '0.5rem'
                        }}
                      >
                        {form}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedVerb.notes && (
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: 'var(--code-background-color)',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}>
                  <strong>💡 Note :</strong> {selectedVerb.notes}
                </div>
              )}

              <div style={{
                marginTop: '2rem',
                textAlign: 'center',
                padding: '1rem',
                background: 'var(--code-background-color)',
                borderRadius: '4px'
              }}>
                <p style={{ margin: 0, color: 'var(--muted-color)' }}>
                  Les exercices interactifs arrivent bientôt ! 🚀
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
