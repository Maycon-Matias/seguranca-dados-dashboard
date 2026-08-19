const { exec } = require('child_process');

console.log('🔍 Verificando segurança do banco de dados existente...');

// Executar o script de verificação
exec('npx tsx scripts/verify-database-safety.ts', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Erro ao verificar banco:', error);
    return;
  }
  
  if (stderr) {
    console.error('⚠️ Avisos:', stderr);
  }
  
  console.log(stdout);
});
