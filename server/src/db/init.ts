import { dbPublic, dbPrivate } from './database.js';

console.log('🚀 Initialisation des bases de données...');

// Bases déjà initialisées avec la structure par défaut
await dbPublic.read();
await dbPrivate.read();

console.log('✅ Bases de données initialisées avec succès !');
console.log('\n📊 Base PUBLIQUE (verbes) :');
console.log('   - verbs');
console.log(`   📁 Fichier : versionné dans git`);

console.log('\n📊 Base PRIVÉE (utilisateurs) :');
console.log('   - users');
console.log('   - user_verbs_progress');
console.log(`   📁 Fichier : exclu du git (.gitignore)`);

console.log('\n⚠️  Important : Seule la base publique (verbes) est dans git.');
console.log('   Les données utilisateurs restent locales et privées.');

process.exit(0);
