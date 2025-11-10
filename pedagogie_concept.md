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

## 👩‍🏫 Public cible

- Élèves francophones du Luxembourg (cycle inférieur, "Cycle 4.2" typiquement) apprenant l'allemand.
- Âge : 11–14 ans (début consolidation grammaire / vocabulaire).
- **Contexte spécifique** : au Luxembourg, la plupart des cours sont dispensés en allemand, ce qui rend la maîtrise des verbes irréguliers cruciale pour la compréhension générale.
- Extension possible : enseignants (suivi de classe) + parents (vue synthèse).
- Contraintes : temps limité, charge cognitive modérée, interface claire et non surchargée.

---

## 📦 Corpus & organisation pédagogique

- **Taille cible du corpus initial : ~120–150 verbes irréguliers fréquents.**
  En Allemagne et au Luxembourg, ce corpus standard est enseigné progressivement entre 12 et 14 ans (niveaux A1–B1 du CECR).

- Découpage en paquets ("sets") de 10–15 verbes pour éviter la surcharge.

- **Groupement par :**
  - **Fréquence** : haute (fondamentale), moyenne (extension), basse (bonus)
  - **Schéma phonétique** : e→i (geben → gab → gegeben), a→ä (fahren → fuhr → gefahren), ie→o (fliegen → flog → geflogen), etc.
  - **Thème d'usage** : déplacements (gehen, fahren, laufen), communication (sprechen, sagen), quotidien (essen, trinken), école (lernen, schreiben).

- **Progression graduelle** : un paquet n+1 n'est proposé que si ≥80% de maîtrise du paquet n.

### Familles phonétiques (exemples)
Ces regroupements aident les élèves à repérer des **régularités dans l'irrégularité** :

| Famille | Infinitiv | Präteritum | Partizip II | Auxiliaire |
|---------|-----------|------------|-------------|------------|
| **e → a → e** | geben | gab | gegeben | haben |
| **e → a → o** | nehmen | nahm | genommen | haben |
| **a → u → a** | fahren | fuhr | gefahren | sein |
| **ie → o → o** | fliegen | flog | geflogen | sein |
| **ei → i → ie** | leihen | lieh | geliehen | haben |

Ces patterns facilitent la mémorisation et réduisent la charge cognitive.

---

## 📚 Structure de contenu linguistique

Chaque verbe comprend :

| Champ | Exemple (kriechen) | Description |
|-------|----------|-------------|
| Infinitiv | kriechen | Forme de base du verbe |
| Präteritum | kroch | Forme passée simple (narration, écrit) |
| Partizip II | gekrochen | Utilisé dans Perfekt / Plusquamperfekt |
| Hilfsverb | sein | Auxiliaire (haben ou sein) pour les temps composés |
| Sonderformen Präsens | du kriechst, er kriecht | Forme(s) spécifique(s) au présent si mutation |
| Übersetzung (FR) | ramper | Traduction d'aide (sans sur-apprentissage) |

**Note** : le verbe **kriechen** (ramper) utilise l'auxiliaire **sein** car il indique un déplacement.

---

## 🧩 Modèle de données linguistique

Le modèle de données doit couvrir l’ensemble des informations nécessaires à l’apprentissage et à la génération d’exercices.

```json
{
  "verb_id": 1,
  "infinitiv": "kriechen",
  "praeteritum": "kroch",
  "partizip_ii": "gekrochen",
  "sonderformen_praesens": ["du kriechst", "er kriecht"],
  "hilfsverb": "sein",
  "alternatives": null,
  "translation_fr": "ramper",
  "phonetic_family": "ie→o→o pattern",
  "frequency_rank": 85,
  "set_id": 1,
  "examples": [
    "Die Schlange kriecht durch das Gras.",
    "Das Baby ist unter den Tisch gekrochen."
  ],
  "audio_url": "https://cdn/.../kriechen.mp3",
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

## 🧠 Méthodes pédagogiques intégrées

### 1. **Répétition espacée (Système Leitner / SM2 simplifié)**
   - **Principe** : les verbes mal maîtrisés reviennent plus souvent, ceux bien connus sont espacés dans le temps.
   - Algorithme quotidien : sélection des verbes en retard + nouveautés.
   - Ajustement dynamique de l'intervalle via `ease_factor` selon la performance.
   - Inspiré de **Anki** (algorithme SM2) et du **système Leitner** (boîtes de révision).

### 2. **Apprentissage contextuel**
   - Minimum : 1 phrase statique + 1 phrase générée (option IA).
   - Mise en évidence de l'auxiliaire dans phrases Perfekt / Plusquamperfekt.
   - Exemple : *"Ich bin zur Schule **gekrochen**."* (auxiliaire **sein** mis en valeur).

### 3. **Feedback constructif granulaire**
   - Typologie des erreurs (préfixe ge-, mutation voyelle, auxiliaire).
   - Message adapté à l'âge, tonalité bienveillante et positive.
   - Exemple : *"Presque ! Tu as oublié le préfixe **ge-** dans le participe."*

### 4. **Approche multisensorielle**
   - **Texte** + **audio natif** (TTS) + **couleur** (statut : rouge / orange / vert / bleu découverte).
   - Plus tard : prononciation via micro (STT) pour évaluer la production orale.
   - Aide à fixer la prononciation et le rythme.

### 5. **Gamification légère**
   - Badges (10, 25, 50 verbes maîtrisés).
   - Séries quotidiennes (streak) : encourager la pratique régulière.
   - Classement restreint (privé / groupe classe).
   - Progression par niveaux : Bronze → Argent → Or.

---

## 💡 Inspirations d'applications reconnues

| Application | Ce qu'on en retient |
|-------------|---------------------|
| **Duolingo** | Gamification, répétition intelligente, progression par niveaux |
| **Quizlet** | Cartes flashcards + tests automatiques, mode apprentissage |
| **Anki** | Algorithme Leitner/SM2, personnalisation avancée |
| **Reverso Conjugaison / Conjugemos** | Apprentissage par répétition ciblée des formes verbales |
| **Babbel** | Contextualisation immédiate, phrases d'usage réel |

**VerbMeister** combine la rigueur de Quizlet avec la créativité ludique de Duolingo, mais **centré sur un seul sujet : les verbes irréguliers allemands**.

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

## 🤖 Rôle de l'IA OpenAI (phase ultérieure)

L'intégration de l'API OpenAI permettra d'enrichir l'expérience d'apprentissage :

1. **Génération de phrases d'exemple variées et naturelles**
   - Contrôle de la longueur et du vocabulaire selon le niveau CECR (A1–B1).
   - Éviter la mémorisation mécanique en proposant des contextes différents à chaque session.
   - Exemple : *"Die Katze ist auf den Baum gekrochen."* vs *"Wir sind langsam den Berg gekrochen."*

2. **Feedback intelligent et personnalisé**
   - Correction bienveillante avec explication simplifiée.
   - Exemple : *"Tu as écrit 'gekriecht' mais le participe correct est 'gekrochen' (pas de 't' final)."*

3. **Contextualisation des verbes**
   - Fournir des contextes d'usage précis : *kriechen* → mouvement lent et bas, *gehen* → se déplacer à pied, *fahren* → avec véhicule.

4. **Mini-dialogues pour immersion**
   - Création de dialogues courts (2–3 répliques) pour favoriser la compréhension en contexte.
   - Exemple :
     — *Wo ist die Katze?*
     — *Sie ist unter das Bett gekrochen.*

5. **Adaptation dynamique de la difficulté**
   - Sélection de verbes proches phonétiquement si erreurs récurrentes.
   - Proposition d'exercices ciblés sur les faiblesses détectées.

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

### Phase 1 : Fondations (MVP minimal)
1. **Modèle de données** (`verbs`, `users`, `user_verbs_progress`) + seed de 15 verbes (groupe L).
2. **API Express basique** `/api/verbs` (GET list, GET by id).
3. **Front React** : liste des verbes + fiche détaillée + audio TTS.

### Phase 2 : Exercices de base
4. **QCM** (3 distracteurs algorithmiques générés).
5. **Saisie libre** + validation + feedback (comparaison caractères).
6. **Phrase à compléter** : exercices contextuels simples.

### Phase 3 : Progression et suivi
7. **Stockage de la progression** utilisateur (scores, erreurs).
8. **Algorithme de révision** quotidienne (répétition espacée simple).
9. **Tableau de bord** : verbes dus aujourd'hui, progression globale.

### Phase 4 : Gamification
10. **Badges initiaux** : 10 verbes maîtrisés, série parfaite, 7 jours consécutifs.
11. **Indicateurs visuels** : pastilles de couleur selon le niveau de maîtrise.

### Phase 5 : Intelligence artificielle
12. **Intégration OpenAI API** : génération de phrases dynamiques.
13. **Feedback intelligent** : correction automatique avec explications.

### Phase 6 : Production
14. **Tests automatisés** : Vitest (unitaires) + Playwright (e2e).
15. **Optimisations** : lazy loading, cache, compression.
16. **Déploiement** : VPS OVH, Nginx, SSL (HTTPS), PM2.

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
