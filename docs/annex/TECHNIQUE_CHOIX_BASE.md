# 🗄️ Choix de Base de Données : LowDB vs SQLite

> Statut: document d'analyse détaillée (annexe). Pour l'usage quotidien du projet, se référer aux 4 fichiers principaux: `pedagogie_concept.md`, `stack_strategie.md`, `implementation_stack.md`, `checklist_developpement.md`.

## 🤔 Pourquoi LowDB et pas SQLite comme Brume ?

### Contexte : L'échec better-sqlite3

Lors de l'initialisation du projet VerbMeister, **better-sqlite3** a échoué à l'installation sur Windows.

**Pourquoi cet échec ?**

**better-sqlite3** est un **module natif** (C++) qui nécessite une **compilation** lors de l'installation :

```bash
npm install better-sqlite3
# → Lance node-gyp
# → Cherche Python 3.x
# → Cherche Visual Studio Build Tools
# → Compile le binding C++ → Node.js
```

**Sur ton environnement Windows actuel :**
- ❌ Python non configuré pour node-gyp
- ❌ Visual Studio Build Tools absents ou mal configurés
- ❌ Compilation échouée

**Résultat :** Impossible d'installer better-sqlite3 → Switch vers LowDB

---

## ✅ Pourquoi ça a marché pour Brume ?

### Hypothèse 1 : Binaire précompilé disponible

better-sqlite3 fournit des **binaires précompilés** pour certaines configurations :

- Node.js 20.x + Windows x64 + version récente → **binaire disponible**
- Pas de compilation nécessaire, installation directe

**Si le binaire était disponible** lors de l'installation de Brume il y a 2 jours :
- ✅ Installation réussie sans Python ni compilateur
- ✅ Projet fonctionnel immédiatement

### Hypothèse 2 : Environnement différent

Brume a peut-être été installé/déployé dans un contexte différent :

- 🐧 **VPS Linux** : Compilation native plus simple (gcc, make, python3 souvent préinstallés)
- 🪟 **Windows avec Python déjà configuré** : node-gyp fonctionnel
- 🐋 **Conteneur Docker** : Image avec build tools préinstallés

### Hypothèse 3 : Version Node.js

Selon la version de Node.js utilisée, les binaires précompilés peuvent varier :

- Node.js 18.x → binaire disponible ✅
- Node.js 20.x → binaire manquant ❌ → compilation requise

---

## 📊 Comparaison LowDB vs SQLite pour VerbMeister

### Statistiques actuelles

**Base VerbMeister** (aujourd'hui) :
```json
Taille : 6.17 KB
Contenu : 1 utilisateur, 15 verbes
Dernière écriture : 10/11/2025 11:54
```

**Projection à 1 an** (usage familial + classe) :
- 50 utilisateurs max
- 200 verbes
- ~50 000 entrées de progression
- **Taille estimée : 300-500 KB**

### Performance comparée

| Opération | LowDB (< 1MB) | SQLite | PostgreSQL |
|-----------|---------------|--------|------------|
| **Lecture simple** | < 1ms | < 1ms | 5-10ms (réseau) |
| **Écriture simple** | 2-5ms | 1-2ms | 10-20ms (réseau) |
| **Requête complexe** | 10-50ms | 1-5ms | 10-30ms (réseau) |
| **Concurrent users** | < 10 | < 100 | Milliers |

**Pour VerbMeister avec < 500 KB :**
- LowDB est **largement suffisant** ✅
- Différence imperceptible pour l'utilisateur

---

## 🎯 Quand utiliser quoi ?

### ✅ LowDB est idéal pour :

- **Prototypage rapide** : Pas de setup DB, pas de schéma SQL
- **Petites apps** : < 1 MB de données
- **Peu d'utilisateurs** : < 100 concurrent
- **Déploiement simple** : Pas de compilation, fonctionne partout
- **Debugging facile** : Fichier JSON lisible humainement
- **Sauvegarde triviale** : Simple copie de fichier

**👉 Cas d'usage VerbMeister : parfaitement adapté**

### ✅ SQLite (better-sqlite3) est idéal pour :

- **Apps moyennes** : 1-500 MB de données
- **Performance** : Requêtes complexes avec INDEX
- **Intégrité** : Transactions ACID, contraintes FK
- **Utilisateurs** : 10-100 concurrent
- **Production locale** : Desktop apps, Electron

**👉 Cas d'usage Brume : adapté si > 100 utilisateurs ou données > 1 MB**

### ✅ PostgreSQL est idéal pour :

- **Apps larges** : > 500 MB de données
- **Scalabilité** : Milliers d'utilisateurs simultanés
- **Features avancées** : Full-text search, JSON, GIS
- **Production cloud** : Séparation app ↔ DB
- **Analytics** : Requêtes complexes sur gros volumes

**👉 Cas d'usage : VerbMeister en mode SaaS avec milliers d'écoles**

---

## 🔄 Stratégie de Migration

### Quand migrer de LowDB → SQLite ?

**Indicateurs** :
- ✅ Base > 5 MB
- ✅ > 100 utilisateurs actifs
- ✅ Requêtes lentes (> 100ms)
- ✅ Besoin de transactions complexes

**Comment migrer** :

1. **Préparer le schéma SQL** :

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'eleve',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  last_login TEXT
);

CREATE TABLE verbs (
  id INTEGER PRIMARY KEY,
  infinitiv TEXT NOT NULL,
  praeteritum TEXT,
  partizip_ii TEXT,
  hilfsverb TEXT,
  translation_fr TEXT,
  set_id INTEGER,
  group_label TEXT
);

CREATE TABLE user_verbs_progress (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  verb_id INTEGER NOT NULL,
  level TEXT DEFAULT 'new',
  accuracy_history TEXT,
  last_review_at TEXT,
  next_review_at TEXT,
  attempt_count INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (verb_id) REFERENCES verbs(id)
);
```

2. **Script de migration** :

```typescript
import Database from 'better-sqlite3';
import { db as lowdb } from './database.js';

const sqlite = new Database('verbmeister.db');

// Migrer users
const insertUser = sqlite.prepare(`
  INSERT INTO users (id, email, password_hash, first_name, last_name, role, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

await lowdb.read();
for (const user of lowdb.data.users) {
  insertUser.run(
    user.id,
    user.email,
    user.password_hash,
    user.first_name,
    user.last_name,
    user.role,
    user.created_at
  );
}

// Répéter pour verbs et user_verbs_progress
```

3. **Adapter `server/src/db/database.ts`** :

```typescript
import Database from 'better-sqlite3';

export const db = new Database('verbmeister.db');

// Remplacer les appels LowDB par SQL
```

4. **Tester et déployer**

### Quand migrer de SQLite → PostgreSQL ?

**Indicateurs** :
- ✅ > 500 utilisateurs simultanés
- ✅ Besoin de séparation app ↔ DB (scaling horizontal)
- ✅ Besoin de features avancées (full-text search, réplication)
- ✅ Déploiement multi-serveurs

---

## 🛡️ Sécurité de LowDB

### ⚠️ Limitations à connaître

1. **Pas de transactions ACID complètes**
   - Écriture atomique sur fichier complet
   - Risque de corruption en cas de crash pendant write()

2. **Pas de concurrent writes**
   - Plusieurs processus écrivant simultanément → race condition
   - Solution : Un seul serveur Node.js (cas actuel)

3. **Pas de contraintes SQL**
   - Pas de FOREIGN KEY, UNIQUE automatiques
   - Validation à faire en application

### ✅ Bonnes pratiques LowDB

```typescript
// Toujours lire avant d'écrire
await db.read();

// Modifier
db.data.users.push(newUser);

// Écrire immédiatement
await db.write();

// Éviter les writes concurrents
// Utiliser un mutex si nécessaire
```

### 🔒 Sécurité des données

**Sauvegarde automatique** (recommandé) :

```bash
# Cron quotidien
0 3 * * * cp /var/www/VerbMeister/server/data/verbmeister.json \
             /var/backups/verbmeister/backup-$(date +\%Y\%m\%d).json
```

**Permissions fichier** :

```bash
sudo chmod 644 /var/www/VerbMeister/server/data/verbmeister.json
sudo chown www-data:www-data /var/www/VerbMeister/server/data/
```

---

## 📝 Conclusion

### Pour VerbMeister aujourd'hui

**LowDB est le choix optimal** ✅

**Raisons** :
- ✅ Installation sans compilation (Windows, Linux, macOS)
- ✅ Base < 10 KB actuellement, projection < 500 KB
- ✅ < 100 utilisateurs attendus
- ✅ Déploiement trivial
- ✅ Debugging facile
- ✅ Sauvegarde simple
- ✅ Pas de setup DB externe

**Limites connues** :
- ⚠️ Pas optimal pour > 1000 utilisateurs simultanés
- ⚠️ Performances dégradées si base > 5 MB
- ⚠️ Pas de transactions complexes

**Migration future** :
- Si succès de l'app → migration vers SQLite triviale
- Si SaaS à grande échelle → PostgreSQL

### Pour Brume (comparaison)

Si Brume a plus d'utilisateurs ou de données, SQLite était le bon choix.

Si Brume tourne sur VPS Linux, better-sqlite3 s'installe facilement.

---

**Date** : 10 novembre 2025
**Auteur** : Michaël Stilmant
**Contexte** : Choix technique VerbMeister
