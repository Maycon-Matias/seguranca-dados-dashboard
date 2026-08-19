const { exec } = require('child_process');

console.log('🏢 Testando conexão com PoraCred MongoDB Atlas...');

// Executar o script de teste
exec('npx tsx scripts/test-poracred-connection.ts', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Erro ao testar conexão:', error);
    return;
  }
  
  if (stderr) {
    console.error('⚠️ Avisos:', stderr);
  }
  
  console.log(stdout);
});
