const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Executando migração de vídeos para o Cloudinary...');

// Executar o script TypeScript
exec('npx tsx scripts/migrate-videos.ts', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Erro ao executar migração:', error);
    return;
  }
  
  if (stderr) {
    console.error('⚠️ Avisos:', stderr);
  }
  
  console.log(stdout);
  console.log('\n✅ Migração concluída!');
});
