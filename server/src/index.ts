import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import verbsRoutes from './routes/verbs.js';
import healthRoutes from './routes/health.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  }
});

const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging simple
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes API
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/verbs', verbsRoutes);

// Servir les fichiers statiques en production
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientPath));

  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

// Socket.IO pour le temps réel (notifications, etc.)
io.on('connection', (socket) => {
  console.log(`✅ Client connecté : ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`❌ Client déconnecté : ${socket.id}`);
  });
});

// Gestionnaire d'erreurs global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Erreur:', err);
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Démarrage du serveur
httpServer.listen(PORT, () => {
  console.log(`\n🚀 Serveur démarré !`);
  console.log(`📡 API : http://localhost:${PORT}`);
  console.log(`🔌 WebSocket : ws://localhost:${PORT}`);
  console.log(`📝 Environnement : ${process.env.NODE_ENV || 'development'}\n`);
});

export { io };
