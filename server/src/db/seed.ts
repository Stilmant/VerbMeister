import { dbPublic } from './database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🌱 Seed des verbes en cours...');

// Charger le fichier JSON des verbes
const verbsPath = path.join(__dirname, '../../../data/verbs_seed.de.json');
const verbsData = JSON.parse(fs.readFileSync(verbsPath, 'utf-8'));

await dbPublic.read();

let count = 0;
for (const verb of verbsData) {
  // Vérifier si le verbe existe déjà
  const exists = dbPublic.data!.verbs.some(v => v.infinitiv === verb.infinitiv);

  if (!exists) {
    const newVerb = {
      id: dbPublic.data!._nextIds.verbs++,
      infinitiv: verb.infinitiv,
      praeteritum: verb.praeteritum,
      partizip_ii: verb.partizip_ii,
      hilfsverb: verb.hilfsverb,
      sonderformen_praesens: verb.sonderformen_praesens,
      alternatives: verb.alternatives,
      translation_fr: verb.translation_fr,
      set_id: verb.set_id,
      group_label: verb.group_label,
      notes: verb.notes || undefined
    };

    dbPublic.data!.verbs.push(newVerb);
    count++;
    console.log(`  ✓ ${verb.infinitiv} (${verb.translation_fr})`);
  }
}

await dbPublic.write();

console.log(`\n✅ ${count} verbes insérés dans la base PUBLIQUE !`);
console.log(`📊 Total des verbes : ${dbPublic.data!.verbs.length}`);
console.log(`📁 Fichier versionné dans git pour partage du corpus.`);

process.exit(0);
