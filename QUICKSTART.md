# 🚀 Guide de démarrage rapide - VerbMeister

## Installation complète du projet

Voici les étapes pour installer et démarrer le projet VerbMeister.

### 1. Installer les dépendances root

```powershell
npm install
```

### 2. Installer les dépendances du serveur

```powershell
cd server
npm install
cd ..
```

### 3. Installer les dépendances du client

```powershell
cd client
npm install
cd ..
```

### 4. Initialiser la base de données

```powershell
cd server
npm run db:init
```

### 5. Charger les verbes (seed)

```powershell
npm run db:seed
cd ..
```

### 6. Démarrer l'application

```powershell
npm run dev
```

L'application sera accessible sur :
- **Frontend** : http://localhost:5173
- **API** : http://localhost:3000

---

## Structure créée

```
VerbMeister/
├── server/              # Backend Express + TypeScript
│   ├── src/
│   │   ├── db/          # Base de données SQLite
│   │   ├── routes/      # Routes API
│   │   └── index.ts     # Point d'entrée serveur
│   └── package.json
│
├── client/              # Frontend React + Vite
│   ├── src/
│   │   ├── pages/       # Pages (Register, Login, Dashboard)
│   │   ├── components/  # Composants réutilisables
│   │   ├── store/       # Zustand store
│   │   └── App.tsx
│   └── package.json
│
├── data/                # Données et base de données
│   ├── verbs_seed.de.json
│   └── verbmeister.db   (créé après init)
│
└── package.json         # Root scripts
```

---

## Fonctionnalités actuelles

✅ **Inscription** : Créer un compte élève
✅ **Connexion** : Se connecter avec email/mot de passe
✅ **Tableau de bord** : Voir les 15 verbes du groupe L
✅ **Fiche verbe** : Affichage détaillé (Infinitiv, Präteritum, Partizip II, Hilfsverb, Sonderformen)
✅ **Navigation** : Sélectionner différents verbes

🚧 **À venir** : Exercices interactifs, progression, gamification

---

## Prochaines étapes

1. Tester l'inscription d'un élève
2. Explorer les 15 verbes du groupe L
3. Développer les premiers exercices (QCM)
4. Ajouter le système de progression

---

Bon apprentissage ! 🇩🇪📚
