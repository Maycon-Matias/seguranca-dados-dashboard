const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Executando migração completa de clientes e vídeos para o Cloudinary...');
console.log('📋 Este processo irá:');
console.log('   - Migrar todos os vídeos dos clientes para o Cloudinary');
console.log('   - Atualizar as URLs no arquivo clientes.json');
console.log('   - Criar backup do arquivo original');
console.log('   - Gerar relatório detalhado');
console.log('');

// Executar o script TypeScript
exec('npx tsx scripts/migrate-clientes-videos.ts', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Erro ao executar migração:', error);
    return;
  }
  
  if (stderr) {
    console.error('⚠️ Avisos:', stderr);
  }
  
  console.log(stdout);
  console.log('\n✅ Migração de clientes e vídeos concluída!');
  console.log('🌍 Agora todos os vídeos estão acessíveis de qualquer lugar!');
});
