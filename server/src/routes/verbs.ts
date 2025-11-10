import { Router, Request, Response } from 'express';
import db from '../db/database.js';

const router = Router();

// GET /api/verbs - Liste tous les verbes
router.get('/', async (req: Request, res: Response) => {
  try {
    await db.read();

    const verbs = db.data!.verbs
      .sort((a, b) => {
        if (a.set_id !== b.set_id) return a.set_id - b.set_id;
        return a.infinitiv.localeCompare(b.infinitiv);
      })
      .map(({ id, infinitiv, praeteritum, partizip_ii, hilfsverb, sonderformen_praesens, translation_fr, set_id, group_label, notes }) => ({
        id,
        infinitiv,
        praeteritum,
        partizip_ii,
        hilfsverb,
        sonderformen_praesens,
        translation_fr,
        set_id,
        group_label,
        notes
      }));

    res.json(verbs);
  } catch (error) {
    console.error('Erreur lors de la récupération des verbes:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des verbes' });
  }
});

// GET /api/verbs/:id - Récupérer un verbe spécifique
router.get('/:id', async (req: Request, res: Response) => {
  try {
    await db.read();

    const verb = db.data!.verbs.find(v => v.id === parseInt(req.params.id));

    if (!verb) {
      return res.status(404).json({ error: 'Verbe non trouvé' });
    }

    res.json(verb);
  } catch (error) {
    console.error('Erreur lors de la récupération du verbe:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du verbe' });
  }
});

// GET /api/verbs/set/:setId - Récupérer les verbes d'un set
router.get('/set/:setId', async (req: Request, res: Response) => {
  try {
    await db.read();

    const verbs = db.data!.verbs
      .filter(v => v.set_id === parseInt(req.params.setId))
      .sort((a, b) => a.infinitiv.localeCompare(b.infinitiv))
      .map(({ id, infinitiv, praeteritum, partizip_ii, hilfsverb, sonderformen_praesens, translation_fr, notes }) => ({
        id,
        infinitiv,
        praeteritum,
        partizip_ii,
        hilfsverb,
        sonderformen_praesens,
        translation_fr,
        notes
      }));

    res.json(verbs);
  } catch (error) {
    console.error('Erreur lors de la récupération des verbes:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des verbes' });
  }
});

export default router;
