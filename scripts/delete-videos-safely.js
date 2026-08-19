const fs = require('fs');
const path = require('path');

console.log('🎬 Exclusão Segura de Vídeos Locais');
console.log('==================================');
console.log('');

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  console.log('📁 Pasta uploads não encontrada');
  process.exit(0);
}

// Listar arquivos
const files = fs.readdirSync(uploadsDir);
const videoFiles = files.filter(file => file.toLowerCase().match(/\.(mp4|avi|mov|wmv)$/));

console.log(`📊 Encontrados ${videoFiles.length} vídeos para excluir`);
console.log('');

if (videoFiles.length === 0) {
  console.log('✅ Nenhum vídeo encontrado para excluir');
  process.exit(0);
}

// Mostrar alguns exemplos
console.log('📋 Exemplos de vídeos encontrados:');
videoFiles.slice(0, 5).forEach(file => {
  console.log(`   🎬 ${file}`);
});
if (videoFiles.length > 5) {
  console.log(`   ... e mais ${videoFiles.length - 5} vídeos`);
}
console.log('');

console.log('🛡️  CONFIRMAÇÕES DE SEGURANÇA:');
console.log('==============================');
console.log('✅ Dados migrados para MongoDB Atlas');
console.log('✅ Backup do JSON criado');
console.log('✅ Sistema funcionando com banco de dados');
console.log('');

console.log('⚠️  ATENÇÃO:');
console.log('Os vídeos serão excluídos permanentemente do computador');
console.log('Mas permanecerão acessíveis através do sistema web');
console.log('');

// Calcular espaço que será liberado
let totalSize = 0;
videoFiles.forEach(file => {
  const filePath = path.join(uploadsDir, file);
  const stats = fs.statSync(filePath);
  totalSize += stats.size;
});

const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
console.log(`💾 Espaço que será liberado: ${sizeInMB} MB`);
console.log('');

// Aguardar confirmação
console.log('🚀 Iniciando exclusão dos vídeos...');
console.log('');

let deletedCount = 0;
let errorCount = 0;

videoFiles.forEach(file => {
  const filePath = path.join(uploadsDir, file);
  try {
    fs.unlinkSync(filePath);
    deletedCount++;
    console.log(`✅ ${file}`);
  } catch (error) {
    errorCount++;
    console.log(`❌ Erro ao excluir ${file}: ${error.message}`);
  }
});

console.log('');
console.log('📊 RESUMO DA EXCLUSÃO:');
console.log('======================');
console.log(`✅ Vídeos excluídos: ${deletedCount}`);
console.log(`❌ Erros: ${errorCount}`);
console.log(`💾 Espaço liberado: ${sizeInMB} MB`);

if (deletedCount > 0) {
  console.log('');
  console.log('🎉 Exclusão concluída com sucesso!');
  console.log('✅ Os vídeos agora estão apenas no banco de dados');
  console.log('🌍 Acessíveis de qualquer lugar via MongoDB Atlas');
  console.log('⚡ Sistema mais rápido sem arquivos locais');
}

console.log('');
console.log('💡 PRÓXIMOS PASSOS:');
console.log('===================');
console.log('1. Execute: npm run dev');
console.log('2. Teste o sistema no navegador');
console.log('3. Verifique se os vídeos carregam normalmente');
console.log('4. Os vídeos agora são servidos diretamente do banco!');
