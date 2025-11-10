# 🚀 Stack & Stratégie Technique — Projet d’évaluation (Meta-Declarative Ready)

## 🎯 Objectif

Ce document définit la stack technique, les outils, et la philosophie d’architecture pour une application d’évaluation moderne, scalable, et prête à évoluer vers la **programmation méta-déclarative**.

---

## 🏗️ Stack technique retenue

### **Front-end**
- **React 18** : Composants UI modulaires, écosystème mature
- **Vite** : Dev server ultra-rapide, build moderne
- **TypeScript** : Typage fort, robustesse, auto-complétion
- **Zustand** : Gestion d’état globale simple et efficace
- **Pico.css** : Styles responsive, mobile-first, sans surcharge

### **Back-end**
- **Node.js** : Runtime JS performant
- **Express** : API REST, middlewares, structure claire
- **Socket.IO** : Communication temps réel (chat, notifications, collaboration)
- **Base de données** :
  - **LowDB** (base JSON file-based, sans compilation native)
  - Simple, performante pour petites/moyennes bases
  - Option future : PostgreSQL si scalabilité nécessaire
- **Authentification** :
  - **JWT** (JSON Web Token) pour sessions sécurisées
  - **bcryptjs** pour le hash des mots de passe (pure JS, pas de dépendances natives)

### **Outils & DevOps**
- **ESLint/Prettier** : Qualité et formatage du code
- **Vitest/Jest** : Tests unitaires et d’intégration
- **GitHub Actions** : CI/CD (tests, build, déploiement)
- **Docker** (optionnel) : Conteneurisation pour dev/prod

---

## 🧭 Principes d’architecture

- **Full TypeScript** (front & back) : robustesse, refactoring facile
- **API REST + WebSocket** : découplage, extensibilité
- **Gestion d’état centralisée (Zustand)** : synchronisation UI/serveur
- **UI 100% déclarative (React)** : préparation à la génération dynamique
- **Styles minimalistes (Pico.css)** : responsive, accessible, sans surcouche
- **Sécurité** : Authentification JWT, validation des entrées, CORS, rate limiting
- **Prêt pour la méta-déclaration** :
  - Les écrans, formulaires, workflows pourront être décrits en JSON à terme
  - L’architecture permet d’injecter un moteur d’interprétation déclaratif plus tard

---

## 🛤️ Direction & évolutivité

- **Démarrage** :
  - UI React/TS + Zustand + Pico.css
  - API Express/TS + Socket.IO + LowDB
- **Évolution** :
  - Migration possible vers PostgreSQL
  - Ajout d’un moteur de génération d’UI (méta-déclaratif)
  - Export mobile (React Native) si besoin
- **Tests & CI** :
  - Tests unitaires et d’intégration dès le début
  - CI/CD automatisé

---

## 📚 Inspirations & références
- Voir `/docs/Meta-Declarative-AI-Runtime/` pour la vision long terme
- Voir le document `trampoline-stack-react-vite-typescript.md` pour la structure recommandée
- S’inspirer des bonnes pratiques du projet Brume (gestion des sessions, persistance, sécurité)

---

## ✍️ À compléter
- **Description métier du projet**
- **Cas d’usage principaux**
- **Spécifications fonctionnelles**

---

**Ce document sert de boussole technique pour toute l’équipe. Tous les choix technologiques sont cohérents avec l’objectif d’une application moderne, scalable, et future-proof pour la programmation méta-déclarative.**

*Dernière mise à jour : 10 novembre 2025*