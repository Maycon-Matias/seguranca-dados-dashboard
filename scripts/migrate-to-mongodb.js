const { exec } = require('child_process');

console.log('🗄️ Executando migração para MongoDB...');
console.log('📋 Este processo irá:');
console.log('   - Conectar ao MongoDB');
console.log('   - Migrar todos os clientes do JSON para o banco');
console.log('   - Criar backup do arquivo JSON original');
console.log('   - Gerar relatório da migração');
console.log('');

// Executar o script TypeScript
exec('npx tsx scripts/migrate-to-mongodb.ts', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Erro ao executar migração:', error);
    return;
  }
  
  if (stderr) {
    console.error('⚠️ Avisos:', stderr);
  }
  
  console.log(stdout);
  console.log('\n✅ Migração para MongoDB concluída!');
  console.log('🗄️ Agora você tem um banco de dados robusto e escalável!');
});
