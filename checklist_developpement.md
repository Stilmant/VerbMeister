# ✅ Checklist Développement

> Liste courte et actionnable pour mettre en route et valider la stack. Complète `STACK-STRATEGIE.md` et `IMPLEMENTATION-STACK.md`.

---

## 1) Pré-requis locaux
- [ ] Node.js 20+ installé (`node -v`).
- [ ] PNPM ou NPM OK (`pnpm -v` ou `npm -v`).
- [ ] Git OK (`git --version`).
- [ ] VS Code avec extensions: ESLint, Prettier, TypeScript, React.

## 2) Structure du repo
- [ ] Créer dossiers `server/` et `client/` comme décrit.
- [ ] Ajouter `README.md`, `LICENSE`, `.gitignore`, `.editorconfig`.
- [ ] Créer `.env.example` avec `PORT=3000`.

## 3) Backend Express + Socket.IO
- [ ] `server/index.ts` avec Express, routes `/api/health` et `/api/messages`.
- [ ] HTTP server et Socket.IO attachés.
- [ ] `server/sockets.ts` avec événements `chat:join`, `chat:message`, `chat:typing`.
- [ ] Scripts NPM: `dev:server`, `start`.

## 4) Frontend React + Vite + TS
- [ ] `client/` initialisé avec Vite React TS.
- [ ] Pico.css importé dans `client/src/main.tsx`.
- [ ] Router: `/` et `/chat`.
- [ ] Zustand store: `useAppStore.ts` (user, messages, typingUsers, connected).
- [ ] Composants: `ChatBox.tsx`, pages `Home.tsx`, `Chat.tsx`.
- [ ] Script NPM: `dev:client`, `build:client`.

## 5) Dev unifié
- [ ] Installer `concurrently` au root.
- [ ] Ajouter script `dev` qui lance `dev:server` et `dev:client`.
- [ ] Vérifier HMR côté Vite sur `http://localhost:5173`.
- [ ] Front communique avec API et Socket sur `http://localhost:3000`.

## 6) Qualité et formatage
- [ ] ESLint + Prettier configurés (root).
- [ ] Lint script: `lint` et `lint:fix`.
- [ ] Husky pré-commit (optionnel) pour `lint-staged`.

## 7) Tests rapides
- [ ] `GET /api/health` renvoie `{ ok: true }`.
- [ ] Deux onglets du navigateur reçoivent les messages en temps réel.
- [ ] Déconnexion et reconnexion Socket loguées côté serveur.

## 8) Build prod et service unique
- [ ] `cd client && npm run build`.
- [ ] Express sert `client/dist` en production.
- [ ] `npm run start` lance API + WebSocket + fichiers statiques.

## 9) Déploiement VPS OVH
- [ ] SSH clé publique OK. Utilisateur `ubuntu`.
- [ ] Mises à jour: `sudo apt update && sudo apt upgrade -y`.
- [ ] Installer `nginx`, `nodejs`, `npm`, `pm2`.
- [ ] Cloner le repo dans `/var/www/<app>`.
- [ ] `npm install` côté `client` et `server` si séparés.
- [ ] `pm2 start server.js --name <app>` puis `pm2 save` et `pm2 startup`.
- [ ] Nginx reverse proxy vers `localhost:3000`.
- [ ] Certbot: `sudo certbot --nginx -d <sous-domaine>`.

## 10) Vérifications prod
- [ ] `https://<sous-domaine>` affiche l’app.
- [ ] `pm2 list` montre `<app>` en `online`.
- [ ] `sudo systemctl status nginx` est `active (running)`.
- [ ] WebSocket OK derrière Nginx (test chat).

## 11) Observabilité minimale
- [ ] Logs: `pm2 logs <app>` et fichiers de logs persistés.
- [ ] Route `/api/health` inclut `uptime`, `version`.
- [ ] Option: `pino-http` pour logs structurés JSON.

## 12) Sécurité essentielle
- [ ] UFW: `OpenSSH` et `Nginx Full` uniquement.
- [ ] Fail2ban activé (optionnel) pour SSH.
- [ ] Mises à jour automatiques de sécurité activées.
- [ ] Secrets hors Git, variables via `.env` et système.

## 13) Backups et snapshots
- [ ] Snapshot OVH pris après mise en ligne stable.
- [ ] Backup base de données si ajoutée plus tard.
- [ ] Script de restauration documenté.

## 14) CI simple (optionnel)
- [ ] GitHub Actions: lint + build client.
- [ ] Test minimal de la route `/api/health`.

---

### Notes
- Ce projet est **classique** par choix. Pas de couche déclarative pour l’instant.
- Les futures expérimentations méta-déclaratives vivront dans un dossier `/meta` et un dépôt séparé.

**Dernière mise à jour**: 10 novembre 2025

