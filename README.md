# 🇩🇪 VerbMeister

Application d'apprentissage des verbes irréguliers allemands pour élèves francophones (12-14 ans, Luxembourg).

## 🎯 Objectif

Aider les élèves à mémoriser et maîtriser les *unregelmäßige Verben* (verbes irréguliers allemands) à travers des exercices interactifs, une progression suivie et une gamification motivante.

## 🏗️ Stack Technique

- **Front-end** : React 18 + TypeScript + Vite + Zustand + Pico.css
- **Back-end** : Node.js + Express + Socket.IO + TypeScript
- **Base de données** : LowDB (JSON file-based, sans dépendances natives)
- **Authentification** : JWT + bcryptjs

## 📁 Structure du Projet

```
VerbMeister/
├── server/          # Backend Express + API
├── client/          # Frontend React
├── data/            # Base de données et seeds
└── docs/            # Documentation pédagogique
```

## 🚀 Démarrage Rapide

### Pré-requis
- Node.js 20+
- npm ou pnpm

### Installation

1. Cloner le repository
```bash
git clone <repo-url>
cd VerbMeister
```

2. Installer les dépendances (root, server, client)
```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

3. Configurer l'environnement
```bash
cp .env.example .env
# Modifier JWT_SECRET et autres variables
```

4. Initialiser et peupler la base de données
```bash
cd server
npm run db:init
npm run db:seed
cd ..
```

5. Lancer en mode développement
```bash
npm run dev
```

L'application sera accessible sur :
- Front-end : http://localhost:5173
- API : http://localhost:3000

## 📚 Documentation

### Références principales
- [Pédagogie & Concept](./pedagogie_concept.md)
- [Stack & Stratégie](./stack_strategie.md)
- [Implémentation](./implementation_stack.md)
- [Checklist Développement](./checklist_developpement.md)

### Annexes (optionnel)
- [Déploiement VPS](./DEPLOYMENT_VPS.md)

Astuce: les autres documents d'analyse détaillée ont été conservés à la racine pour référence (TECHNIQUE_CHOIX_BASE.md, REPONSE_SQLITE_LOWDB.md, ETAT_PROJET.md, DECISIONS_TECHNIQUES.md), mais ne sont pas nécessaires au quotidien.

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e
```

## 📦 Build Production

```bash
npm run build
npm run start
```

## 🌐 Déploiement VPS

Voir le guide complet de déploiement sur OVH/Ubuntu : **[DEPLOYMENT_VPS.md](./DEPLOYMENT_VPS.md)**

Le guide couvre :
- Configuration Nginx + PM2
- Certificat SSL Let's Encrypt
- Sauvegarde base LowDB
- Mises à jour et monitoring

## 🤝 Contribution

Ce projet est conçu comme référence pour l'apprentissage de l'architecture full-stack moderne et la programmation méta-déclarative.

## 📝 Licence

MIT

---

**Auteur** : Michaël Stilmant
**Date** : Novembre 2025
