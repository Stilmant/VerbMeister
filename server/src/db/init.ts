import db from './database.js';

console.log('🚀 Initialisation de la base de données...');

// La base de données est déjà initialisée avec la structure par défaut
await db.read();

console.log('✅ Base de données initialisée avec succès !');
console.log('📊 Structure :');
console.log('   - users');
console.log('   - verbs');
console.log('   - user_verbs_progress');
console.log(`\n📁 Fichier : ${db.data}`);

process.exit(0);
