# 🧠 Pédagogie & Concept — Apprentissage des Verbes Irréguliers (Allemand)

> Ce document complète les fichiers `STACK-STRATEGIE.md`, `IMPLEMENTATION-STACK.md` et `CHECKLIST-DEVELOPPEMENT.md`.
> Il définit les **fondements didactiques**, les **objectifs pédagogiques**, les **axes fonctionnels** et le **modèle de données linguistique** du projet.

---

## 🎯 Objectif général

Créer une application web ludique et interactive destinée aux élèves du cycle secondaire (12–14 ans, niveau A1–B1), pour :

- Mémoriser les formes principales des verbes irréguliers allemands.
- Comprendre leur usage dans différents temps et contextes.
- S’exercer à l’écrit et à l’oral, avec une progression suivie et personnalisée.
- Encourager la pratique régulière et autonome grâce à des activités variées.

---

## 📚 Structure de contenu linguistique

Chaque verbe comprend :

| Champ | Exemple | Description |
|-------|----------|-------------|
| Infinitiv | kriechen | Forme de base du verbe |
| Präteritum | kroch | Passé simple allemand |
| Partizip II | gekrochen | Utilisé pour le parfait et plus-que-parfait |
| Hilfsverb | sein | Verbe auxiliaire utilisé (haben/sein) |
| Sonderformen Präsens | du lädst, er lädt | Forme irrégulière spécifique |
| Übersetzung (FR) | aller | Traduction française |

Les verbes sont regroupés par **familles phonétiques** :
- e → i (geben → gab → gegeben)
- a → ä (fahren → fuhr → gefahren)
- ie → o (fliegen → flog → geflogen)

---

## 🧩 Modèle de données linguistique

Le modèle de données doit couvrir l’ensemble des informations nécessaires à l’apprentissage et à la génération d’exercices.

```json
{
  "verb_id": 42,
  "infinitiv": "kriechen",
  "praeteritum": "kroch",
  "partizip_ii": "gekrochen",
  "sonderformen_praesens": ["du kriechst", "er kriecht"],
  "hilfsverb": "sein",
  "alternatives": null,
  "translation_fr": "ramper",
  "audio_url": "https://cdn/.../kriechen.mp3",
  "notes": ""
}
```

### Détails supplémentaires
- **alternatives** : pour gérer plusieurs formes valides (`melkte` / `molk`).
- **notes** : remarques spécifiques (emploi rare, mixte, etc.).
- **audio_url** : référence à un enregistrement natif ou TTS.
- **translation_fr** : ajout obligatoire pour contextualiser les exercices.
- **hilfsverb** : sert pour l’apprentissage du *Perfekt* et *Plusquamperfekt*.

Ce modèle permettra à la fois :
- l’apprentissage direct (affichage complet),
- les exercices (QCM, saisie, phrases à compléter),
- les fonctionnalités IA (génération de phrases et feedback).

---

## 🧱 Architecture logicielle (rappel synthétique)

| Couche | Technologie | Description |
|--------|--------------|-------------|
| Front-end | React 18 + TypeScript (Vite) | Interface d’apprentissage |
| State | Zustand | Gestion globale (verbes, progression, utilisateur) |
| Back-end | Node.js + Express + Socket.IO | API + synchronisation temps réel |
| Auth | JWT + bcrypt | Sécurité utilisateur |
| DB | SQLite / PostgreSQL | Stockage des verbes, profils et scores |
| IA | OpenAI API (optionnelle) | Génération de phrases et feedback intelligent |

---

## 🚀 Nom du projet (propositions)

| Nom | Sens / Avantage |
|------|----------------|
| **VerbMeister** | “Le maître des verbes” — simple, clair, ludique |
| **Verbo** | Court, international, facile à retenir |
| **UnregelBot** | Clin d’œil à *unregelmäßig* + aspect éducatif/IA |
| **VerbQuest** | Dimension ludique de progression et de quête |
| **SprachFluss** | “Flux de langue” — métaphore fluide et poétique |

---

**Auteur :** Michaël Stilmant  
**Dernière mise à jour :** 10 novembre 2025
