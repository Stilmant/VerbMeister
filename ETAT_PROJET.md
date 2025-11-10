# 📊 État du Projet VerbMeister

> Document central de suivi du projet : fonctionnalités implémentées, roadmap détaillée, prochaines étapes.

**Date** : 10 novembre 2025
**Status** : ✅ Phase 1 Complete (Auth + Dashboard Verbes)
**Prochaine Phase** : 🚧 Exercices Interactifs (QCM, Saisie Libre)

---

## 🎯 Ce Qui Fonctionne

### ✅ Infrastructure
- [x] Projet React 18 + TypeScript + Vite
- [x] Backend Express + TypeScript + Socket.IO
- [x] Base de données LowDB (6.17 KB, 1 user + 15 verbes)
- [x] Authentication JWT + bcryptjs
- [x] State management Zustand avec localStorage persistence

### ✅ Fonctionnalités Utilisateur
- [x] Inscription élève (email, prénom, nom, mot de passe)
- [x] Connexion avec session persistante
- [x] Dashboard avec liste des 15 verbes (groupe L)
- [x] Sélection et affichage détaillé d'un verbe
- [x] Logout fonctionnel
- [x] UI responsive avec Pico.css
- [x] Badge "DE" stylé (drapeau allemand)

### ✅ API Backend
- [x] `POST /api/auth/register` - Créer un compte
- [x] `POST /api/auth/login` - Se connecter
- [x] `GET /api/verbs` - Liste tous les verbes
- [x] `GET /api/verbs/:id` - Détails d'un verbe
- [x] `GET /api/verbs/set/:setId` - Verbes par groupe

---

## 📈 Statistiques Actuelles

```
Base de données    : LowDB (JSON)
Taille actuelle    : 6.17 KB
Utilisateurs       : 1
Verbes chargés     : 15 (groupe L : kriechen → nennen)
Progression        : 0 entrées (pas encore d'exercices)
Performance        : < 1ms par requête
Dernière écriture  : 10/11/2025 11:54
```

---

## 🚀 Projections

### Capacité LowDB

| Métrique | Actuel | Projection 6 mois | Projection 1 an | Limite LowDB |
|----------|--------|-------------------|-----------------|--------------|
| **Utilisateurs** | 1 | 10-20 | 50 | 500 |
| **Verbes** | 15 | 50 | 200 | 1000 |
| **Progression** | 0 | 500 | 5000 | 50000 |
| **Taille DB** | 6 KB | 50 KB | 300 KB | 5 MB |
| **Performance** | < 1ms | < 2ms | < 5ms | < 50ms |

**Conclusion** : LowDB reste optimal pendant **plusieurs années** ✅

---

## 🔄 Choix Technique : LowDB vs SQLite

### Pourquoi LowDB ?

**better-sqlite3 a échoué sur Windows** :
```bash
npm install better-sqlite3
# ❌ Erreur : Python + Visual Studio Build Tools requis
# ❌ Compilation native échouée
```

**LowDB : solution sans friction** :
```bash
npm install lowdb
# ✅ Pure JavaScript, zéro compilation
# ✅ Fonctionne Windows, Linux, macOS
# ✅ Installation instantanée
```

### Comparaison Technique

| Critère | LowDB | better-sqlite3 |
|---------|-------|----------------|
| **Installation Windows** | ✅ Pure JS | ❌ Compilation C++ |
| **Setup requis** | Aucun | Python + Build Tools |
| **Performance < 1MB** | ✅ Excellent | ✅ Excellent |
| **Débogage** | ✅ JSON lisible | ⚠️ Base binaire |
| **Sauvegarde** | ✅ Copie fichier | ⚠️ SQLite dump |
| **Transactions ACID** | ⚠️ Basiques | ✅ Complètes |
| **Adapté VerbMeister** | ✅ **Oui** | ⚠️ Overkill |

**Verdict** : LowDB parfait pour VerbMeister ✅

Pour l'analyse complète : **[TECHNIQUE_CHOIX_BASE.md](./TECHNIQUE_CHOIX_BASE.md)**

---

---

## 🗺️ Roadmap Détaillée

### ❌ Fonctionnalités Manquantes (Analyse Complète)

#### **EXERCICES** (Phase 2 - pedagogie_concept.md)
- ❌ QCM (choix multiples sur Präteritum/Partizip II/auxiliaire)
- ❌ Saisie libre (validation stricte + tolérance accents)
- ❌ Phrases à compléter (contexte réel)
- ❌ Mode chrono vs mode étude

#### **PROGRESSION & RÉVISION** (Phase 3)
- ❌ Modèle `user_verbs_progress` en DB
- ❌ Algorithme répétition espacée (Leitner/SM2)
- ❌ Niveaux par verbe : découverte → apprentissage → maîtrisé
- ❌ Calendrier révisions ("due today")
- ❌ Historique erreurs par catégorie

#### **GAMIFICATION** (Phase 4)
- ❌ Badges (10/25/50 verbes, streak, série parfaite)
- ❌ Streak jours consécutifs
- ❌ Pastilles couleur selon niveau (🔵🟡🟢)
- ❌ Progression Bronze/Argent/Or

#### **AUDIO & IA** (Phase 5+)
- ❌ TTS (Web Speech API ou Google TTS)
- ❌ OpenAI génération phrases contextuelles
- ❌ Feedback intelligent sur erreurs

---

## 🎯 Plan d'Implémentation Priorisé

### 🥇 PHASE 2 : Exercices de Base (PRIORITÉ IMMÉDIATE)

#### **2.1 - Exercice QCM Präteritum/Partizip II** ⭐⭐⭐

**Backend**
- [ ] Route `GET /api/exercises/qcm/:verbId` - Génère question + 4 options
  - 1 bonne réponse (verbe sélectionné)
  - 3 distracteurs algorithmiques (präteritum d'autres verbes)
- [ ] Route `POST /api/exercises/qcm/validate` - Vérifie réponse
  - Payload: `{ verb_id, answer, type: 'praeteritum' | 'partizip_ii' }`
  - Retour: `{ correct: boolean, correctAnswer: string, feedback: string }`

**Frontend**
- [ ] Page `/exercises/qcm`
- [ ] Composant `QuestionCard.tsx`
  - Affichage : "Quelle est la forme Präteritum de **kriechen** ?"
  - 4 boutons options (mélangés aléatoirement)
- [ ] Feedback visuel immédiat (vert ✅ / rouge ❌)
- [ ] Bouton "Question suivante"
- [ ] Score affiché (X/10)

**Algorithme Distracteurs**
```typescript
// Sélectionner 3 autres verbes aléatoires
// Extraire leur präteritum
// Mélanger avec la bonne réponse
// Éviter doublons
```

**Estimation** : 4-6 heures

---

#### **2.2 - Exercice Saisie Libre** ⭐⭐⭐

**Backend**
- [ ] Route `POST /api/exercises/input/validate`
  - Payload: `{ verb_id, answer, expectedForm: 'praeteritum' | 'partizip_ii' }`
  - Validation stricte avec tolérance accents (`ä` = `ae`)
  - Détection erreurs : préfixe ge-, mutation voyelle, terminaison
  - Retour: `{ correct: boolean, errors: string[], hint?: string }`

**Frontend**
- [ ] Page `/exercises/input`
- [ ] Affichage : infinitiv + traduction
- [ ] Input texte pour saisie
- [ ] Validation on submit
- [ ] Feedback constructif :
  - ✅ Correct : "Parfait ! **kroch** est la bonne forme"
  - ❌ Erreur : "Presque ! Tu as oublié le préfixe **ge-**"
- [ ] Bouton "Indice" (limite 2 par verbe)

**Estimation** : 5-7 heures

---

#### **2.3 - Phrases à Compléter** ⭐⭐

**Backend**
- [ ] Ajouter champ `examples` dans seed verbs (2-3 phrases/verbe)
- [ ] Route `GET /api/exercises/sentence/:verbId`
  - Retourne phrase avec trou : "Die Katze ist unter den Tisch ____."
  - Indices : type de forme attendue

**Frontend**
- [ ] Page `/exercises/sentence`
- [ ] Affichage phrase avec input inline
- [ ] Validation contextuelle
- [ ] Mise en évidence auxiliaire si Perfekt

**Estimation** : 3-4 heures

---

### 🥈 PHASE 3 : Système de Progression

#### **3.1 - Modèle & API Progression** ⭐⭐⭐

**Backend - Modèle DB**
```typescript
interface UserVerbProgress {
  id: number;
  user_id: number;
  verb_id: number;
  level: "découverte" | "apprentissage" | "maîtrisé";
  accuracy_history: ("wrong" | "almost" | "good")[];
  last_review_at: string;
  next_review_at: string;
  attempt_count: number;
  error_types: string[];
  hints_used: number;
}
```

**Backend - Routes**
- [ ] `POST /api/progress/verb/:id/attempt`
  - Payload: `{ correct, exerciseType, errors?, time_spent }`
  - Met à jour progression, recalcule next_review_at
- [ ] `GET /api/progress/due` - Verbes à réviser aujourd'hui
- [ ] `GET /api/progress/stats` - Statistiques globales user

**Algorithme Répétition Espacée (Leitner simplifié)**
```typescript
// Boîte 1 (nouveau) : révision demain
// Boîte 2 (apprentissage) : révision dans 3 jours
// Boîte 3 (maîtrisé) : révision dans 7 jours

// Si correct → boîte +1
// Si erreur → retour boîte 1
```

**Estimation** : 6-8 heures

---

#### **3.2 - Dashboard Progression** ⭐⭐

**Frontend**
- [ ] Section "À réviser aujourd'hui" (verbes `due`)
- [ ] Pastilles couleur par verbe :
  - 🔵 Découverte (0-1 tentative)
  - 🟡 Apprentissage (2-5 tentatives, <80% précision)
  - 🟢 Maîtrisé (>5 tentatives, >80% précision)
- [ ] Barre progression globale (X/15 verbes maîtrisés)
- [ ] Graphique précision par verbe (optionnel)

**Store Zustand**
- [ ] Ajouter `progress: UserVerbProgress[]`
- [ ] Action `loadProgress()`, `updateProgress(verbId, result)`

**Estimation** : 4-5 heures

---

### 🥉 PHASE 4 : Gamification

#### **4.1 - Système de Badges** ⭐⭐

**Backend**
- [ ] Modèle `user_badges` en DB
```typescript
interface Badge {
  id: string; // "first_verb", "10_verbs", "perfect_streak"
  name: string;
  description: string;
  icon: string;
  unlocked_at?: string;
}
```
- [ ] Route `GET /api/badges` - Liste badges utilisateur
- [ ] Logique déclenchement automatique après exercices

**Frontend**
- [ ] Page `/profile/badges`
- [ ] Toast notification à l'obtention
- [ ] 3 badges initiaux :
  - 🎯 "Premier Verbe" (1 verbe maîtrisé)
  - 🔥 "10 Verbes" (10 verbes maîtrisés)
  - ⚡ "Série Parfaite" (5 bonnes réponses consécutives)

**Estimation** : 3-4 heures

---

#### **4.2 - Streak Jours Consécutifs** ⭐

**Backend**
- [ ] Ajouter `last_activity_date`, `current_streak` dans user
- [ ] Logique calcul streak (réinitialise si >24h inactivité)

**Frontend**
- [ ] Badge streak dans navbar (🔥 7 jours)
- [ ] Encouragement quotidien si streak actif

**Estimation** : 2-3 heures

---

#### **4.3 - Niveaux Bronze/Argent/Or**

**Logique**
- Bronze : 0-20 verbes maîtrisés
- Argent : 21-50 verbes
- Or : 51-100 verbes
- Platine : 100+ verbes

**Frontend**
- [ ] Badge niveau dans navbar
- [ ] Animation passage niveau supérieur

**Estimation** : 2 heures

---

### 🚀 PHASE 5+ : Extensions Futures

#### **5.1 - Audio TTS** ⭐⭐
- [ ] Web Speech API ou Google Cloud TTS
- [ ] Bouton lecture sur fiche verbe
- [ ] Prononciation dans exercices

**Estimation** : 3-4 heures

---

#### **5.2 - OpenAI Génération Phrases** ⭐
- [ ] Intégration API OpenAI
- [ ] Génération phrases contextuelles (niveau A1-B1)
- [ ] Feedback intelligent sur erreurs

**Estimation** : 6-8 heures

---

#### **5.3 - Mode Classe Enseignant**
- [ ] Rôle `enseignant` avec dashboard multi-élèves
- [ ] Export CSV progression classe

**Estimation** : 10-15 heures

---

#### **5.4 - PWA Offline**
- [ ] Service Worker
- [ ] Cache dernier set + audio
- [ ] Sync différée résultats

**Estimation** : 8-10 heures

---

## 📊 Priorités Recommandées

### 🎯 **Sprint 1 (1-2 semaines)** : Exercices de Base
1. ✅ QCM Präteritum/Partizip II (4-6h)
2. ✅ Saisie Libre (5-7h)
3. ✅ Phrases à Compléter (3-4h)

**Livrable** : App utilisable pour pratiquer les 15 verbes avec 3 types d'exercices

---

### 🎯 **Sprint 2 (1-2 semaines)** : Progression & Tracking
4. ✅ Modèle user_verbs_progress + API (6-8h)
5. ✅ Algorithme répétition espacée (inclus)
6. ✅ Dashboard progression (4-5h)

**Livrable** : Système de révision intelligent avec suivi personnalisé

---

### 🎯 **Sprint 3 (1 semaine)** : Gamification
7. ✅ Badges (3-4h)
8. ✅ Streak (2-3h)
9. ✅ Niveaux (2h)

**Livrable** : Motivation et engagement long terme

---

### 🎯 **Sprint 4+ (optionnel)** : Extensions
10. Audio TTS
11. OpenAI génération
12. Mode classe
13. PWA offline

---

## 🚦 Décision : Par Où Commencer ?

**Recommandation** : **PHASE 2.1 - QCM**

**Pourquoi ?**
- ✅ Fonctionnalité la plus attendue (exercices interactifs)
- ✅ Valide le flux complet exercice → validation → feedback
- ✅ Relativement simple techniquement (4-6h)
- ✅ Rend l'app **immédiatement utilisable** par votre fille

**Plan d'action QCM** :
1. Créer route backend `GET /api/exercises/qcm/:verbId`
2. Créer page frontend `ExerciseQCM.tsx`
3. Composant `QuestionCard` avec 4 options
4. Algorithme génération distracteurs
5. Validation + feedback visuel (vert/rouge)
6. Score et bouton "Recommencer"

**Voulez-vous qu'on implémente le QCM maintenant ?** 🚀

---

## 📚 Documentation Projet

### Fichiers Créés Aujourd'hui

| Fichier | Description |
|---------|-------------|
| **[TECHNIQUE_CHOIX_BASE.md](./TECHNIQUE_CHOIX_BASE.md)** | Analyse complète LowDB vs SQLite vs PostgreSQL |
| **[REPONSE_SQLITE_LOWDB.md](./REPONSE_SQLITE_LOWDB.md)** | Réponse à ta question sur l'échec SQLite |
| **[DEPLOYMENT_VPS.md](./DEPLOYMENT_VPS.md)** | Guide déploiement OVH/Ubuntu complet |

### Documentation Mise à Jour

- ✅ **README.md** : Stack corrigée (LowDB au lieu de SQLite)
- ✅ **QUICKSTART.md** : Instructions simplifiées
- ✅ **stack_strategie.md** : Choix techniques actualisés
- ✅ **pedagogie_concept.md** : Architecture DB corrigée
- ✅ **implementation_stack.md** : Étapes cochées

---

## 🎓 Pour Ta Fille

**VerbMeister est prêt à l'emploi !**

Elle peut déjà :
1. Créer son compte
2. Se connecter
3. Explorer les 15 premiers verbes
4. Voir toutes les formes (Infinitiv, Präteritum, Partizip II, etc.)

**Prochaine étape** : Ajouter les exercices pour qu'elle puisse **pratiquer** et **mémoriser** 🇩🇪

---

## 🤝 Contribution & Évolution

Ce projet sert aussi de **référence technique** pour :
- Architecture full-stack moderne
- TypeScript best practices
- Choix de base de données pragmatiques
- Déploiement production VPS
- Future programmation méta-déclarative

---

**Auteur** : Michaël Stilmant
**Contact** : stilmant@... (à compléter)
**Licence** : MIT
**Repository** : https://github.com/Stilmant/VerbMeister
