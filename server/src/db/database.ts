import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
  last_login?: string;
}

interface Verb {
  id: number;
  infinitiv: string;
  praeteritum: string;
  partizip_ii: string;
  hilfsverb: string;
  sonderformen_praesens: string[];
  alternatives: any;
  translation_fr: string;
  set_id: number;
  group_label: string;
  notes?: string;
}

interface UserVerbProgress {
  id: number;
  user_id: number;
  verb_id: number;
  level: string;
  accuracy_history: string[];
  last_review_at?: string;
  next_review_at?: string;
  attempt_count: number;
  error_types: string[];
  hints_used: number;
  ease_factor: number;
  interval_days: number;
  created_at: string;
}

// Base publique (verbes uniquement, versionné dans git)
interface PublicDatabase {
  verbs: Verb[];
  _nextIds: {
    verbs: number;
  };
}

// Base privée (utilisateurs et progression, exclus du git)
interface PrivateDatabase {
  users: User[];
  user_verbs_progress: UserVerbProgress[];
  _nextIds: {
    users: number;
    user_verbs_progress: number;
  };
}

// Chemins configurables via ENV
const DB_DIR = path.join(__dirname, '../../data');
const DB_PUBLIC_PATH = process.env.DB_PUBLIC_PATH || path.join(DB_DIR, 'verbs.public.json');
const DB_PRIVATE_PATH = process.env.DB_PRIVATE_PATH || path.join(DB_DIR, 'users.private.json');

// Créer le dossier data s'il n'existe pas
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Configuration par défaut - Base publique
const defaultPublicData: PublicDatabase = {
  verbs: [],
  _nextIds: {
    verbs: 1
  }
};

// Configuration par défaut - Base privée
const defaultPrivateData: PrivateDatabase = {
  users: [],
  user_verbs_progress: [],
  _nextIds: {
    users: 1,
    user_verbs_progress: 1
  }
};

// Initialiser les deux bases de données
const publicAdapter = new JSONFile<PublicDatabase>(DB_PUBLIC_PATH);
export const dbPublic = new Low<PublicDatabase>(publicAdapter, defaultPublicData);

const privateAdapter = new JSONFile<PrivateDatabase>(DB_PRIVATE_PATH);
export const dbPrivate = new Low<PrivateDatabase>(privateAdapter, defaultPrivateData);

// Initialiser les bases
await dbPublic.read();
dbPublic.data ||= defaultPublicData;
await dbPublic.write();

await dbPrivate.read();
dbPrivate.data ||= defaultPrivateData;
await dbPrivate.write();

console.log(`✅ Base publique (verbes) : ${DB_PUBLIC_PATH}`);
console.log(`✅ Base privée (users) : ${DB_PRIVATE_PATH}`);

// Export de compatibilité pour migration progressive
// Permet d'accéder aux données via une interface unifiée
export const db = {
  get data() {
    return {
      verbs: dbPublic.data!.verbs,
      users: dbPrivate.data!.users,
      user_verbs_progress: dbPrivate.data!.user_verbs_progress,
      _nextIds: {
        verbs: dbPublic.data!._nextIds.verbs,
        users: dbPrivate.data!._nextIds.users,
        user_verbs_progress: dbPrivate.data!._nextIds.user_verbs_progress
      }
    };
  },
  async read() {
    await dbPublic.read();
    await dbPrivate.read();
  },
  async write() {
    await dbPublic.write();
    await dbPrivate.write();
  }
};

export default db;
