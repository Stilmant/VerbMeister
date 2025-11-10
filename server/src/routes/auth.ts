import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import db from '../db/database.js';

const router = Router();

// Schéma de validation pour l'inscription
const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères')
});

// Schéma de validation pour la connexion
const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis')
});

// POST /api/auth/register - Inscription
router.post('/register', async (req: Request, res: Response) => {
  try {
    // Validation des données
    const validatedData = registerSchema.parse(req.body);

    await db.read();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = db.data!.users.find(u => u.email === validatedData.email);

    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(validatedData.password, 10);

    // Créer le nouvel utilisateur
    const userId = db.data!._nextIds.users++;
    const newUser = {
      id: userId,
      email: validatedData.email,
      password_hash: passwordHash,
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
      role: 'eleve',
      created_at: new Date().toISOString()
    };

    db.data!.users.push(newUser);
    await db.write();

    // Générer un token JWT
    const token = jwt.sign(
      {
        userId,
        email: validatedData.email,
        role: 'eleve'
      },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Inscription réussie !',
      token,
      user: {
        id: userId,
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: 'eleve'
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Données invalides',
        details: error.errors
      });
    }

    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
});

// POST /api/auth/login - Connexion
router.post('/login', async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    await db.read();

    // Récupérer l'utilisateur
    const user = db.data!.users.find(u => u.email === validatedData.email);

    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Mettre à jour la date de dernière connexion
    user.last_login = new Date().toISOString();
    await db.write();

    // Générer un token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Connexion réussie !',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Données invalides',
        details: error.errors
      });
    }

    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

export default router;
