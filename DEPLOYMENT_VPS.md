# 🚀 Guide de Déploiement VPS (OVH)

Guide complet pour déployer VerbMeister sur un VPS Ubuntu avec Nginx, PM2 et Let's Encrypt.

---

## 📋 Prérequis VPS

- Ubuntu 20.04+ / Debian 11+
- Node.js 20+
- Nginx
- PM2 (gestionnaire de processus)
- Certbot (Let's Encrypt)
- Git

---

## 1️⃣ Cloner le Projet

```bash
cd /var/www
sudo git clone https://github.com/Stilmant/VerbMeister.git
cd VerbMeister
```

---

## 2️⃣ Installer les Dépendances

```bash
# Root
sudo npm install

# Server
cd server
sudo npm install
cd ..

# Client
cd client
sudo npm install
cd ..
```

---

## 3️⃣ Configuration Environnement Production

### Fichier `.env` racine

```bash
sudo cp .env.example .env
sudo nano .env
```

**Contenu minimal `.env` :**

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=GENERER_UNE_LONGUE_CLE_ALEATOIRE_SECURISEE
```

> ⚠️ **Important** : Générer un JWT_SECRET fort avec : `openssl rand -base64 64`

### Fichier `.env.production` client (optionnel)

Si tu veux définir l'URL API explicitement côté Vite :

```bash
echo 'VITE_API_URL=https://verbmeister.stilmant.lu/api' | sudo tee client/.env.production
```

> 💡 Par défaut, Vite utilise l'URL du domaine donc ce n'est pas obligatoire si Nginx fait le proxy correctement.

---

## 4️⃣ Initialiser la Base de Données

```bash
cd server
sudo npm run db:init
sudo npm run db:seed
cd ..
```

Cela crée `server/data/verbmeister.json` avec les 15 verbes du groupe L.

> 💡 **Note sur le choix LowDB** : VerbMeister utilise LowDB (base JSON) au lieu de SQLite pour éviter les problèmes de compilation native (better-sqlite3) sur différents environnements. LowDB est parfaitement adapté pour < 500 utilisateurs et < 5 MB de données. Voir [TECHNIQUE_CHOIX_BASE.md](./TECHNIQUE_CHOIX_BASE.md) pour l'analyse complète.

---

## 5️⃣ Build Production

```bash
sudo npm run build
```

**Résultat** :
- Frontend compilé dans `client/dist/`
- Backend compilé dans `server/dist/`

---

## 6️⃣ Configuration PM2

Créer le fichier de configuration PM2 :

```bash
sudo tee ecosystem.verbmeister.config.js >/dev/null <<'PM2'
module.exports = {
  apps: [
    {
      name: "verbmeister-api",
      cwd: "./server",
      script: "dist/index.js",
      env: {
        NODE_ENV: "production",
        PORT: "3001"
      },
      instances: 1,
      exec_mode: "cluster",
      max_restarts: 10,
      exp_backoff_restart_delay: 3000,
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z"
    }
  ]
}
PM2
```

### Démarrer l'application avec PM2

```bash
# Créer le dossier logs
sudo mkdir -p server/logs

# Démarrer
sudo pm2 start ecosystem.verbmeister.config.js

# Sauvegarder la config PM2 pour redémarrage auto
sudo pm2 save

# Activer le démarrage automatique au boot
sudo pm2 startup
```

### Commandes PM2 utiles

```bash
sudo pm2 list                    # Liste des apps
sudo pm2 logs verbmeister-api    # Logs en temps réel
sudo pm2 restart verbmeister-api # Redémarrer l'app
sudo pm2 stop verbmeister-api    # Arrêter l'app
sudo pm2 reload verbmeister-api  # Reload sans downtime
sudo pm2 delete verbmeister-api  # Supprimer l'app
```

---

## 7️⃣ Configuration Nginx

### Créer le Virtual Host

```bash
sudo tee /etc/nginx/sites-available/verbmeister.conf >/dev/null <<'NGINX'
# Redirection HTTP → HTTPS
server {
    listen 80;
    server_name verbmeister.stilmant.lu;
    return 301 https://$host$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    server_name verbmeister.stilmant.lu;

    # Certificats SSL (Let's Encrypt)
    ssl_certificate     /etc/letsencrypt/live/verbmeister.stilmant.lu/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/verbmeister.stilmant.lu/privkey.pem;

    # Sécurité SSL moderne
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';

    # Frontend (React SPA)
    root /var/www/VerbMeister/client/dist;
    index index.html;

    # Assets statiques (cache 7 jours)
    location /assets/ {
        try_files $uri =404;
        expires 7d;
        access_log off;
        add_header Cache-Control "public, immutable";
    }

    # Favicon
    location = /favicon.ico {
        try_files $uri =404;
        access_log off;
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.IO (WebSocket)
    location /socket.io/ {
        proxy_pass http://127.0.0.1:3001/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # React Router : toutes les routes → index.html
    location / {
        try_files $uri /index.html;
    }
}
NGINX
```

### Activer le site

```bash
# Créer le lien symbolique
sudo ln -s /etc/nginx/sites-available/verbmeister.conf /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
```

---

## 8️⃣ Certificat SSL (Let's Encrypt)

### Si le certificat n'existe pas encore

```bash
sudo certbot --nginx -d verbmeister.stilmant.lu
```

Certbot va :
1. Générer le certificat
2. Modifier automatiquement la config Nginx
3. Configurer le renouvellement automatique

### Renouvellement automatique

Certbot installe un cron/timer automatique. Vérifier :

```bash
sudo certbot renew --dry-run
```

---

## 9️⃣ Permissions & Sécurité

```bash
# Permissions sur le projet
sudo chown -R www-data:www-data /var/www/VerbMeister

# Permissions sur la base LowDB (lecture/écriture pour PM2)
sudo chmod 755 /var/www/VerbMeister/server/data
sudo chmod 644 /var/www/VerbMeister/server/data/verbmeister.json

# Firewall (si activé)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

---

## 🔄 Mises à Jour du Projet

Script complet pour mettre à jour l'application :

```bash
cd /var/www/VerbMeister

# Récupérer les derniers changements
sudo git pull

# Réinstaller les dépendances si nécessaire
sudo npm install
cd server && sudo npm install && cd ..
cd client && sudo npm install && cd ..

# Rebuild
sudo npm run build

# Redémarrer PM2 (sans downtime)
sudo pm2 reload verbmeister-api

# Recharger Nginx
sudo systemctl reload nginx

# Vérifier les logs
sudo pm2 logs verbmeister-api --lines 50
```

---

## 💾 Sauvegarde Base de Données

### LowDB (JSON)

La base est un simple fichier JSON : `server/data/verbmeister.json`

**Sauvegarde manuelle** :

```bash
sudo cp /var/www/VerbMeister/server/data/verbmeister.json \
       /var/www/VerbMeister/server/data/verbmeister.backup.$(date +%Y%m%d_%H%M%S).json
```

**Sauvegarde automatique (cron)** :

```bash
sudo crontab -e
```

Ajouter :

```cron
# Sauvegarde quotidienne à 3h du matin
0 3 * * * cp /var/www/VerbMeister/server/data/verbmeister.json /var/backups/verbmeister/verbmeister.$(date +\%Y\%m\%d).json
```

Créer le dossier de backup :

```bash
sudo mkdir -p /var/backups/verbmeister
```

### 📊 Quand migrer vers SQLite/PostgreSQL ?

**LowDB est optimal tant que :**
- ✅ < 500 utilisateurs actifs
- ✅ Base < 5 MB
- ✅ Performances acceptables (< 100ms par requête)

**Indicateurs pour migrer :**
- ❌ Base > 5 MB → Envisager SQLite
- ❌ > 500 utilisateurs simultanés → Envisager PostgreSQL
- ❌ Requêtes lentes (> 200ms) → Envisager migration

**Projections VerbMeister :**
- 1 utilisateur = ~6 KB
- 50 utilisateurs + 200 verbes + progression = **~300-500 KB**
- **LowDB reste optimal pendant des années** ✅

Pour l'analyse complète, voir **[TECHNIQUE_CHOIX_BASE.md](./TECHNIQUE_CHOIX_BASE.md)**

### Migration future vers PostgreSQL (si nécessaire)

Si tu atteins les limites de LowDB :

1. **Installer PostgreSQL** sur le VPS
2. **Créer la base** :
   ```bash
   sudo -u postgres psql
   CREATE DATABASE verbmeister;
   CREATE USER verbmeister_user WITH PASSWORD 'mot_de_passe_fort';
   GRANT ALL PRIVILEGES ON DATABASE verbmeister TO verbmeister_user;
   ```
3. **Modifier** `server/src/db/database.ts` (utiliser `pg` ou `prisma`)
4. **Migrer les données** JSON → SQL (script de migration)
5. **Rebuild et redéployer**

---

## 🐛 Debugging

### Vérifier que l'API répond

```bash
curl http://localhost:3001/api/health
```

### Vérifier les logs PM2

```bash
sudo pm2 logs verbmeister-api --lines 100
```

### Vérifier les logs Nginx

```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Tester la connexion HTTPS

```bash
curl https://verbmeister.stilmant.lu/api/health
```

---

## 📊 Monitoring (optionnel)

### PM2 Plus (anciennement Keymetrics)

```bash
sudo pm2 link <secret_key> <public_key>
```

Monitoring en temps réel sur https://app.pm2.io

---

## ✅ Checklist Déploiement

- [ ] Node.js 20+ installé
- [ ] Nginx installé et actif
- [ ] PM2 installé globalement
- [ ] Projet cloné dans `/var/www/VerbMeister`
- [ ] Dépendances installées (root, server, client)
- [ ] `.env` configuré avec JWT_SECRET fort
- [ ] Base de données initialisée (`db:init` + `db:seed`)
- [ ] Build production exécuté (`npm run build`)
- [ ] PM2 configuré et démarré
- [ ] Nginx vhost créé et activé
- [ ] Certificat SSL Let's Encrypt obtenu
- [ ] Application accessible sur https://verbmeister.stilmant.lu
- [ ] Sauvegarde automatique configurée

---

## 🎉 Résultat

Ton application sera accessible sur :

**🌐 https://verbmeister.stilmant.lu**

Avec :
- ✅ HTTPS (Let's Encrypt)
- ✅ Backend Node.js géré par PM2
- ✅ Frontend React servi par Nginx
- ✅ Base LowDB persistante
- ✅ Redémarrage automatique en cas de crash
- ✅ Renouvellement SSL automatique

---

**Auteur** : Michaël Stilmant
**Projet** : VerbMeister
**Date** : Novembre 2025
