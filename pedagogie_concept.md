# 🧠 Pédagogie & Concept — Apprentissage des Verbes Irréguliers (Allemand)

> Ce document complète les fichiers `stack_strategie.md`, `implementation_stack.md` et `checklist_developpement.md`.
> Il définit les **fondements didactiques**, les **objectifs pédagogiques**, les **axes fonctionnels**, le **modèle de données linguistique** et les **pistes d'évolution** du projet.
>
> Contexte initial : aider une élève (12 ans, Luxembourg) et ses camarades à maîtriser les *unregelmäßige Verben* par une approche structurée, motivante et progressive (A1 → B1). Le projet doit rester simple au départ (MVP) mais ouvert à des extensions (IA, classe, mobile, méta-déclaratif).

---

## 🎯 Objectif général

Créer une application web ludique et interactive destinée aux élèves du cycle secondaire (12–14 ans, niveau A1–B1), pour :

- Mémoriser les formes principales des verbes irréguliers allemands.
- Comprendre leur usage dans différents temps et contextes.
- S’exercer à l’écrit et à l’oral, avec une progression suivie et personnalisée.
- Encourager la pratique régulière et autonome grâce à des activités variées.

---

## �‍🏫 Public cible

- Élèves francophones du Luxembourg (cycle inférieur) apprenant l'allemand.
- Âge : 11–14 ans (début consolidation grammaire / vocabulaire).
- Extension possible : enseignants (suivi de classe) + parents (vue synthèse).
- Contraintes : temps limité, charge cognitive modérée, interface claire et non surchargée.

---

## 📦 Corpus & organisation pédagogique

- Taille cible du corpus initial : ~120–150 verbes irréguliers fréquents.
- Découpage en paquets ("sets") de 10–15 verbes pour éviter la surcharge.
- Groupement par :
  - Fréquence (haute → fondamentale, moyenne → extension, basse → bonus)
  - Schéma phonétique (e→i, a→ä, ie→o, etc.)
  - Thème d'usage (déplacements, communication, quotidien, école).
- Progression graduelle : un paquet n+1 n'est proposé que si ≥80% de maîtrise du paquet n.

---

## �📚 Structure de contenu linguistique

Chaque verbe comprend :

| Champ | Exemple | Description |
|-------|----------|-------------|
| Infinitiv | gehen | Forme de base du verbe |
| Präteritum | ging | Forme passée simple (narration, écrit) |
| Partizip II | gegangen | Utilisé dans Perfekt / Plusquamperfekt |
| Hilfsverb | sein | Auxiliaire (haben ou sein) pour les temps composés |
| Sonderformen Präsens | du gehst, er geht | Forme(s) spécifique(s) au présent si mutation |
| Übersetzung (FR) | aller | Traduction d’aide (sans sur-apprentissage) |

Les verbes sont regroupés par **familles phonétiques** :
- e → i (geben → gab → gegeben)
- a → ä (fahren → fuhr → gefahren)
- ie → o (fliegen → flog → geflogen)

---

## 🧩 Modèle de données linguistique

Le modèle de données doit couvrir l’ensemble des informations nécessaires à l’apprentissage et à la génération d’exercices.

```json
{
  "verb_id": 1,
  "infinitiv": "gehen",
  "praeteritum": "ging",
  "partizip_ii": "gegangen",
  "sonderformen_praesens": ["du gehst", "er geht"],
  "hilfsverb": "sein",
  "alternatives": null,
  "translation_fr": "aller",
  "phonetic_family": "e→i(e) pattern",
  "frequency_rank": 12,
  "set_id": 2,
  "examples": [
    "Ich gehe zur Schule.",
    "Wir sind gestern spät nach Hause gegangen."
  ],
  "audio_url": "https://cdn/.../gehen.mp3",
  "notes": "Verbe de déplacement → auxiliaire sein",
  "spaced_repetition": {
    "ease_factor": 2.5,
    "interval_days": 4,
    "next_review_at": "2025-11-15T10:00:00Z",
    "last_result": "good"
  }
}
```

### Détails supplémentaires
- **alternatives** : pour gérer plusieurs formes valides (`melkte` / `molk`).
- **notes** : remarques spécifiques (emploi rare, mixte, etc.).
- **audio_url** : référence à un enregistrement natif ou TTS.
- **translation_fr** : ajout obligatoire pour contextualiser les exercices.
- **hilfsverb** : sert pour l’apprentissage du *Perfekt* et *Plusquamperfekt*.
- **phonetic_family / set_id** : structuration pédagogique et filtrage.
- **spaced_repetition** : stockage des paramètres (SM2 simplifié ou Leitner).
- **examples** : banque de phrases (statique + générée IA).
- **frequency_rank** : pilotage adaptatif (priorise verbes fréquents + erreurs).

Ce modèle permettra à la fois :
- l’apprentissage direct (affichage complet),
- les exercices (QCM, saisie, phrases à compléter),
- les fonctionnalités IA (génération de phrases et feedback).

### Modèle de progression utilisateur (extrait)

```json
{
  "user_id": 77,
  "verb_id": 1,
  "level": "mastered|learning|review",
  "accuracy_history": ["wrong", "almost", "good"],
  "last_review_at": "2025-11-10T09:00:00Z",
  "next_review_at": "2025-11-15T10:00:00Z",
  "attempt_count": 5,
  "error_types": ["partizip_ii-omission-ge"],
  "hints_used": 1
}
```

---

## � Méthodes pédagogiques intégrées

1. **Répétition espacée (Leitner / SM2 simplifié)**
   - Algorithme quotidien : sélection des verbes en retard + nouveautés.
   - Ajustement dynamique de l'intervalle via `ease_factor`.
2. **Apprentissage contextuel**
   - Minimum : 1 phrase statique + 1 phrase générée (option IA).
   - Mise en évidence de l'auxiliaire dans phrases Perfekt / Plusquamperfekt.
3. **Feedback constructif granulaire**
   - Typologie des erreurs (préfixe ge-, mutation voyelle, auxiliaire).
   - Message adapté âge, tonalité positive.
4. **Multisensoriel**
   - Texte + audio + couleur (statut : rouge / orange / vert / bleu découverte).
   - Plus tard : prononciation via micro (STT).
5. **Gamification légère**
   - Badges (10, 25, 50 verbes maîtrisés).
   - Séries quotidiennes (streak).
   - Classement restreint (privé / groupe classe).

---

## 🧩 Progression pédagogique (niveaux d'activités)

| Niveau | Type d’activité | Objectif | Formats |
|--------|-----------------|----------|---------|
| 1 | Découverte | Familiarisation (formes + audio) | Tableau + écoute |
| 2 | Reconnaissance | Identifier forme correcte | QCM ciblé |
| 3 | Production | Produire forme sans aide | Saisie libre + correction |
| 4 | Contexte | Intégrer dans phrase / temps | Phrase à trou / transformation |
| 5 | Oral | Prononciation & compréhension | TTS (lecture) / STT (plus tard) |

Progression adaptative : pour passer au niveau supérieur sur un verbe → 3 réponses correctes consécutives avec ≤1 aide.

---

## ⚙️ Fonctionnalités du MVP

### Phase 1 — Apprentissage
- Liste filtrable (fréquence, famille, statut).
- Fiche verbe : tableau, auxiliaire, exemples, audio.
- Indicateur maîtrise (pastille couleur).

### Phase 2 — Exercices
- QCM (formes ciblées : Präteritum / Partizip II / auxiliaire).
- Saisie libre (validation stricte + tolérance mineures — accents ignorés).
- Phrase à compléter (1 trou, puis multi-trous).
- Mode chrono (30–60s) vs mode étude.

### Phase 3 — Suivi
- Tableau bord : progression (%) + verbes à revoir (due today).
- Historique erreurs par catégorie.
- Badges obtenus.

---

## 🔐 Gestion des utilisateurs

- Authentification JWT (email + mot de passe hashé bcrypt).
- Rôles : `eleve`, `enseignant`, `admin`.
- Profil élève : avatar, streak, badges, calendrier révisions.
- RGPD simplifié : collecte minimale, possibilité suppression compte.

---

## 🤖 Rôle de l’IA OpenAI (phase ultérieure)

- Génération phrases variées (contrôle longueur / vocabulaire niveau CECR).
- Feedback formulé naturellement : explication + reformulation correcte.
- Suggestion mini-dialogues (2–3 répliques) pour immersion.
- Adaptation difficulté (sélection verbes proches phonétiquement si erreurs récurrentes).

---

## 🚀 Évolutions futures

- Mode classe (tableau suivi multi-élèves).
- Export CSV / PDF (progression, erreurs).
- PWA hors ligne (cache dernier set + audio).
- Mobile React Native (révisions rapides).
- Prononciation (speech-to-text + scoring).
- Moteur méta-déclaratif pour générer écrans exercices via JSON.

---

## �🧱 Architecture logicielle (rappel synthétique)

| Couche | Technologie | Description |
|--------|--------------|-------------|
| Front-end | React 18 + TypeScript (Vite) | Interface d’apprentissage |
| State | Zustand | Gestion globale (verbes, progression, utilisateur) |
| Back-end | Node.js + Express + Socket.IO | API + synchronisation temps réel |
| Auth | JWT + bcrypt | Sécurité utilisateur |
| DB | SQLite / PostgreSQL | Stockage des verbes, profils et scores |
| IA | OpenAI API (optionnelle) | Génération de phrases et feedback intelligent |

Compléments futurs éventuels : `pino` (logs), `zod` (validation schémas), `prisma` (accès DB), `vitest` (tests), `playwright` (tests e2e).

---

## 📅 Étapes de développement recommandées

1. Modèle de données (`verbs`, `users`, `user_verbs_progress`) + seed 10 verbes.
2. API Express basique `/api/verbs` (GET list, GET by id).
3. Front React : liste + fiche verbe + audio.
4. Exercices QCM (3 distracteurs algorithmiques).
5. Saisie libre + feedback (diff caractères).
6. Stockage progression + algorithme révision quotidienne.
7. Tableau de bord simple (verbes dus).
8. Gamification initiale (badge 10 verbes).
9. Intégration IA (phrases dynamiques).
10. Optimisations / déploiement (OVH, HTTPS).

---

## � Cohérence inter-docs

- `stack_strategie.md` : vision technique et principes généraux.
- `implementation_stack.md` : structure concrète du projet (dossiers, flux).
- `checklist_developpement.md` : jalons opérationnels (installation → déploiement).
- `pedagogie_concept.md` (ce fichier) : logique didactique + données + roadmap pédagogique.

---

## �🚀 Nom du projet (propositions)

| Nom | Sens / Avantage |
|------|----------------|
| **VerbMeister** | “Le maître des verbes” — simple, clair, ludique |
| **Verbo** | Court, international, facile à retenir |
| **UnregelBot** | Clin d’œil à *unregelmäßig* + aspect éducatif/IA |
| **VerbQuest** | Dimension ludique de progression et de quête |
| **SprachFluss** | “Flux de langue” — métaphore fluide et poétique |

---

**Auteur :** Michaël Stilmant
**Dernière mise à jour :** 10 novembre 2025 (mise à jour pédagogique étendue)
