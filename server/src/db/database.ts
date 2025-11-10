import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

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

interface Database {
  users: User[];
  verbs: Verb[];
  user_verbs_progress: UserVerbProgress[];
  _nextIds: {
    users: number;
    verbs: number;
    user_verbs_progress: number;
  };
}

const DB_DIR = path.join(__dirname, '../../data');
const DB_PATH = path.join(DB_DIR, 'verbmeister.json');

// Créer le dossier data s'il n'existe pas
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Configuration par défaut de la base de données
const defaultData: Database = {
  users: [],
  verbs: [],
  user_verbs_progress: [],
  _nextIds: {
    users: 1,
    verbs: 1,
    user_verbs_progress: 1
  }
};

const adapter = new JSONFile<Database>(DB_PATH);
export const db = new Low<Database>(adapter, defaultData);

// Initialiser la base de données
await db.read();
db.data ||= defaultData;
await db.write();

console.log(`✅ Base de données connectée : ${DB_PATH}`);

export default db;
