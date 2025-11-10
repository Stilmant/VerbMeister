# 🧩 Implémentation de la Stack — Projet d’évaluation

> Ce document complète le fichier [`STACK-STRATEGIE.md`](./STACK-STRATEGIE.md).
> Il se concentre sur la **mise en œuvre concrète** de la stack React / Express / Socket.IO / TypeScript.
> L’objectif : établir une base traditionnelle, claire et maintenable, avant d’évoluer vers la programmation méta-déclarative.

---

## ⚙️ Objectif immédiat
Créer une application **full-stack classique**, avec un front React 18 (Vite + TypeScript) et un back Express (Node.js + Socket.IO), afin de valider la cohérence du flux complet avant toute abstraction.

---

## 🏧 Structure de projet recommandée

```
project-root/
  server/
    index.ts
    sockets.ts
    routes/
      health.ts
      messages.ts
  client/
    index.html
    src/
      main.tsx
      app.tsx
      router.tsx
      pages/
        Home.tsx
        Chat.tsx
      components/
        ChatBox.tsx
      store/
        useAppStore.ts
      styles/
        index.css
  package.json
  vite.config.ts
  tsconfig.json
  .env.example
  README.md
```

---

## 🧠 Principe général

En **développement**, deux serveurs fonctionnent :
- **Express** (port `3000`) : API REST et Socket.IO.
- **Vite** (port `5173`) : interface React avec hot-reload.

En **production**, un seul serveur Express sert :
- les fichiers statiques du dossier `client/dist`;
- les WebSockets sur le même port.

---

## 🧮 Outils de développement

### Scripts NPM
```json
{
  "scripts": {
    "dev:server": "tsx server/index.ts",
    "dev:client": "vite --host",
    "dev": "concurrently -k \"npm:dev:server\" \"npm:dev:client\"",
    "build:client": "vite build",
    "start": "node dist/server/index.js"
  }
}
```

Le paquet `concurrently` permet de lancer **Vite** et **Express** en parallèle pendant le développement (`npm run dev`).

---

## 🧱 Back-end (Express + Socket.IO)

### `server/index.ts`
- Charge `.env` et initialise Express.
- Routes REST : `/api/health` et `/api/messages`.
- Servir `client/dist` en production.
- Crée le serveur HTTP et attache Socket.IO.

### `server/sockets.ts`
- Gère les connexions temps réel :
  - `chat:join`
  - `chat:message`
  - `chat:typing`
- Utilise `socket.broadcast.emit()` pour la diffusion et la gestion des salons.

---

## 💻 Front-end (React + Vite + Zustand)

### `client/src/main.tsx`
- Point d’entrée React, import `Pico.css`.
- Initialise le routeur et le composant principal.

### `client/src/router.tsx`
- Définit les routes : `/` (Home) et `/chat` (Chat).

### `client/src/pages/Chat.tsx`
- Initialise le client Socket.IO.
- Envoie `chat:join` et `chat:message`.
- Écoute les événements pour mettre à jour le store Zustand.

### `client/src/store/useAppStore.ts`
- État global :
  - `user`, `messages`, `typingUsers`, `connected`.
- Actions : `setUser`, `addMessage`, `setTyping`, `setConnected`.

### `client/src/components/ChatBox.tsx`
- Champ texte + bouton d’envoi.
- `onInput` → `socket.emit('chat:typing')`.
- `onSubmit` → `socket.emit('chat:message')`.

---

## 🌐 Communication front / back

| Type | Technologie | Port | Description |
|------|--------------|------|-------------|
| API REST | Express | 3000 | Données classiques (GET/POST) |
| WebSocket | Socket.IO | 3000 | Messages en temps réel |
| UI | Vite / React | 5173 | Interface avec hot-reload |

---

## 📦 Production

1. Build du front :
   ```bash
   cd client && npm run build
   ```
2. Lancer le serveur unique :
   ```bash
   npm run start
   ```
3. Express sert :
   - `/client/dist` (HTML/CSS/JS),
   - les WebSockets sur le même port.

---

## 🧪 Tests rapides

- **Santé API** → `GET /api/health` doit retourner `{ ok: true }`.
- **Connexion Socket** → un `socket.on('connect')` déclenche un log côté serveur.
- **Chat** → les messages se propagent instantanément sur deux onglets.

---

## 🖯️ Étapes suivantes
1. ✅ ~~Ajouter une persistance simple~~ → **LowDB implémenté** (voir [TECHNIQUE_CHOIX_BASE.md](./TECHNIQUE_CHOIX_BASE.md))
2. ✅ ~~Gérer un mini-auth~~ → **JWT + bcryptjs implémenté**
3. Mettre en place un script CI pour build et test.
4. Préparer un dossier `/meta` pour de futurs essais déclaratifs (plus tard).
5. **Implémenter les exercices QCM** (Phase 2 du pedagogie_concept.md)

---

## 📚 Références
- Voir [`STACK-STRATEGIE.md`](./STACK-STRATEGIE.md) pour les principes généraux et les choix techniques.
- Les prochaines étapes “méta-déclaratives” seront définies dans un document séparé après validation de cette base traditionnelle.

---

**Auteur :** Michael Stilmant
**Dernière mise à jour :** 10 novembre 2025

