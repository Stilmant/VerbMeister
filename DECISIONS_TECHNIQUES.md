# 📝 Décisions Techniques - VerbMeister

Ce document trace les décisions techniques importantes prises pendant le développement.

---

## 🗄️ Base de Données : LowDB (JSON)

**Date** : 10 novembre 2025
**Décision** : Utiliser LowDB au lieu de better-sqlite3

### Contexte

Lors de l'initialisation du projet, `npm install better-sqlite3` a échoué sur Windows :
```
Erreur : Module natif nécessitant compilation C++
Requis : Python 3.x + Visual Studio Build Tools + node-gyp
Environnement actuel : Windows sans Python configuré
Résultat : Installation échouée
```

### Options Considérées

1. **Configurer Python + Build Tools sur Windows**
   - ❌ Setup complexe pour tous les contributeurs
   - ❌ Risque d'échec selon l'environnement
   - ❌ Time consuming

2. **Utiliser LowDB (JSON file-based)**
   - ✅ Pure JavaScript, zéro compilation
   - ✅ Installation instantanée sur tous les OS
   - ✅ Suffisant pour < 500 users et < 5 MB

3. **Utiliser PostgreSQL directement**
   - ❌ Overkill pour usage familial (50 users max)
   - ❌ Nécessite serveur DB externe en dev
   - ❌ Complexité inutile

### Décision Finale

**→ LowDB retenu**

**Raisons** :
- Installation sans friction (Windows, Linux, macOS)
- Suffisant pour cas d'usage VerbMeister (< 500 KB projetés)
- Debugging facile (fichier JSON lisible)
- Sauvegarde triviale (copie de fichier)
- Migration future vers SQLite/PostgreSQL reste possible

**Trade-offs acceptés** :
- ⚠️ Performances dégradées si base > 5 MB (non attendu)
- ⚠️ Pas de transactions ACID complètes (pas critique pour app éducative)
- ⚠️ Max ~100 utilisateurs simultanés (largement suffisant)

**Critères de migration future** :
- Base > 5 MB → Migrer vers SQLite
- > 500 users simultanés → Migrer vers PostgreSQL

**Références** : Voir [TECHNIQUE_CHOIX_BASE.md](./TECHNIQUE_CHOIX_BASE.md)

---

## 🔐 Authentification : bcryptjs (Pure JS)

**Date** : 10 novembre 2025
**Décision** : Utiliser bcryptjs au lieu de bcrypt

### Contexte

`bcrypt` (package originel) est aussi un **module natif** nécessitant compilation.

### Décision

**→ bcryptjs retenu** (pure JavaScript, compatible bcrypt)

**Raisons** :
- ✅ Compatible API avec bcrypt (drop-in replacement)
- ✅ Pure JS, pas de compilation
- ✅ Même sécurité (bcrypt algorithm)
- ⚠️ Légèrement plus lent (~30%) mais imperceptible pour login/register

**Trade-off accepté** :
- Hashing 30% plus lent que bcrypt natif
- Pour VerbMeister : < 10 inscriptions/jour → différence imperceptible

---

## 🎨 UI Framework : Pico.css v2

**Date** : 10 novembre 2025
**Décision** : Utiliser Pico.css au lieu de Tailwind/Bootstrap

### Contexte

Application destinée à des enfants (12-14 ans) → besoin d'UI simple, épurée, lisible.

### Options Considérées

1. **Tailwind CSS**
   - ❌ Verbeux (utility classes partout)
   - ❌ Courbe d'apprentissage
   - ✅ Très flexible

2. **Bootstrap**
   - ❌ Lourd (100+ KB)
   - ❌ Design "corporate" peu adapté
   - ✅ Composants nombreux

3. **Pico.css**
   - ✅ Minimal (10 KB gzipped)
   - ✅ Styles sémantiques (HTML propre)
   - ✅ Design moderne et épuré
   - ✅ Responsive mobile-first

### Décision Finale

**→ Pico.css v2 retenu**

**Raisons** :
- HTML sémantique (pas de classes partout)
- Design minimaliste adapté enfants
- Ultra-léger (10 KB vs 100+ KB Bootstrap)
- Pas de JavaScript requis
- Parfait pour app éducative

**Trade-off accepté** :
- Moins de composants préfabriqués (OK, on code custom)
- Personnalisation limitée (OK, design sobre suffisant)

---

## 🔌 State Management : Zustand

**Date** : 10 novembre 2025
**Décision** : Utiliser Zustand au lieu de Redux/Context API

### Contexte

Besoin de gérer :
- État utilisateur (user, token, isAuthenticated)
- Persistance localStorage
- Synchronisation cross-tabs future

### Options Considérées

1. **Redux Toolkit**
   - ❌ Verbeux (actions, reducers, slices)
   - ❌ Boilerplate important
   - ✅ DevTools excellent

2. **React Context API**
   - ✅ Native React
   - ❌ Performance issues avec nested contexts
   - ❌ Pas de persistance built-in

3. **Zustand**
   - ✅ API simple (hooks)
   - ✅ Minimal boilerplate
   - ✅ Performance optimale
   - ✅ Middleware pour localStorage

### Décision Finale

**→ Zustand retenu**

**Exemple de simplicité** :
```typescript
// Tout le store en 30 lignes
const useAppStore = create<AppStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setUser: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false })
}));
```

**Raisons** :
- API ultra-simple (idéal pour référence pédagogique)
- Performance excellente
- Taille minimale (3 KB)
- Middleware localStorage trivial

---

## 🚀 Dev Server : Vite

**Date** : 10 novembre 2025
**Décision** : Utiliser Vite au lieu de Create React App (CRA)

### Contexte

Create React App est deprecated, besoin d'un dev server moderne.

### Décision

**→ Vite retenu** (évident en 2025)

**Raisons** :
- ✅ Hot Module Replacement ultra-rapide (< 50ms)
- ✅ Build optimisé (Rollup)
- ✅ TypeScript out-of-the-box
- ✅ Recommandé officiellement par React

**Alternative considérée** : Next.js (rejeté car overkill pour SPA simple)

---

## 📦 Module System : ES Modules

**Date** : 10 novembre 2025
**Décision** : Utiliser ES Modules (`type: "module"`) partout

### Contexte

Backend Node.js peut utiliser CommonJS (`require`) ou ES Modules (`import`).

### Décision

**→ ES Modules (ESM) retenu**

**Configuration** :
```json
// package.json
{ "type": "module" }
```

**Raisons** :
- ✅ Standard JavaScript moderne
- ✅ Cohérence front + back (même syntaxe)
- ✅ Future-proof
- ✅ Tree-shaking optimal

**Trade-off** :
- ⚠️ Quelques ajustements (`__dirname` → `fileURLToPath`)
- ✅ Workaround simple documenté

---

## 🎯 Déploiement : PM2 + Nginx

**Date** : 10 novembre 2025
**Décision** : Utiliser PM2 (process manager) au lieu de systemd

### Contexte

Backend Node.js doit tourner en continu sur VPS Ubuntu.

### Options Considérées

1. **systemd service**
   - ✅ Natif Linux
   - ❌ Configuration verbeux
   - ❌ Logs moins pratiques

2. **PM2**
   - ✅ Spécialisé Node.js
   - ✅ Cluster mode
   - ✅ Auto-restart
   - ✅ Logs centralisés
   - ✅ Monitoring intégré

### Décision Finale

**→ PM2 retenu**

**Configuration** :
```javascript
// ecosystem.verbmeister.config.js
module.exports = {
  apps: [{
    name: "verbmeister-api",
    script: "dist/index.js",
    instances: 1,
    exec_mode: "cluster"
  }]
}
```

**Raisons** :
- Restart automatique en cas de crash
- Logs accessibles (`pm2 logs`)
- Monitoring (`pm2 monit`)
- Cohérent avec projet Brume

---

## 🔒 HTTPS : Let's Encrypt (Certbot)

**Date** : 10 novembre 2025
**Décision** : Utiliser Let's Encrypt pour SSL gratuit

### Décision

**→ Let's Encrypt via Certbot**

**Raisons** :
- ✅ Gratuit
- ✅ Renouvellement automatique
- ✅ Reconnu par tous les navigateurs
- ✅ Installation triviale avec Nginx

**Commande** :
```bash
sudo certbot --nginx -d verbmeister.stilmant.lu
```

---

## 📱 UI : Desktop First (Responsive)

**Date** : 10 novembre 2025
**Décision** : Design desktop-first avec responsive mobile

### Contexte

Application éducative utilisée principalement :
- À la maison (desktop/laptop)
- En classe (ordinateurs école)
- Occasionnellement mobile (révision en déplacement)

### Décision

**→ Desktop-first, responsive mobile**

**Raisons** :
- ✅ Usage principal sur ordinateur
- ✅ Exercices plus confortables sur grand écran
- ✅ Pico.css gère le responsive automatiquement

**Trade-off** :
- Pas d'app mobile native (peut venir plus tard avec React Native)

---

## 🎨 Style Flag Allemand : CSS au lieu d'Emoji

**Date** : 10 novembre 2025
**Décision** : Remplacer emoji 🇩🇪 par badge CSS stylé

### Contexte

Emoji 🇩🇪 s'affiche comme texte "DE" sur certains Windows 11 → pas fiable.

### Décision

**→ Badge CSS avec linear-gradient (couleurs drapeau allemand)**

**Code** :
```tsx
<span style={{
  background: 'linear-gradient(to bottom, #000 33%, #DD0000 33% 66%, #FFCE00 66%)',
  color: 'white',
  padding: '0.2rem 0.5rem',
  borderRadius: '4px',
  fontWeight: 'bold'
}}>DE</span>
```

**Raisons** :
- ✅ Fonctionne sur tous les OS
- ✅ Couleurs exactes drapeau allemand
- ✅ Contrôle total du rendu
- ✅ Professionnel

---

## 📝 Résumé des Décisions

| Domaine | Choix | Alternative | Raison |
|---------|-------|-------------|--------|
| **Base de données** | LowDB | SQLite | Installation sans friction Windows |
| **Hashing** | bcryptjs | bcrypt | Pure JS, pas de compilation |
| **UI Framework** | Pico.css | Tailwind | Minimaliste, enfants-friendly |
| **State** | Zustand | Redux | Simple, performant |
| **Dev Server** | Vite | CRA | Moderne, rapide |
| **Module System** | ESM | CommonJS | Standard, future-proof |
| **Process Manager** | PM2 | systemd | Spécialisé Node.js |
| **SSL** | Let's Encrypt | Payant | Gratuit, auto-renew |
| **Flag** | CSS styled | Emoji | Cross-platform reliable |

---

**Principe Directeur** :
*"Pragmatisme > Idéalisme. Choisir la solution qui fonctionne partout et permet d'avancer."*

---

**Auteur** : Michaël Stilmant
**Dernière mise à jour** : 10 novembre 2025
