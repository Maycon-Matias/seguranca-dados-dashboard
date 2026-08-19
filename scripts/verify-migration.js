const { exec } = require('child_process');

console.log('🔍 Verificando status da migração para o Cloudinary...');

// Executar o script de verificação
exec('npx tsx scripts/verify-migration.ts', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Erro ao verificar migração:', error);
    return;
  }
  
  if (stderr) {
    console.error('⚠️ Avisos:', stderr);
  }
  
  console.log(stdout);
});
