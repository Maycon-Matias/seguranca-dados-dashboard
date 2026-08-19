const fs = require('fs');
const path = require('path');

console.log('🧹 Script de Limpeza de Arquivos Locais');
console.log('=====================================');
console.log('');

// Verificar se os dados estão no banco
console.log('⚠️  ANTES DE EXCLUIR, CONFIRME:');
console.log('✅ Todos os 67 clientes estão no MongoDB Atlas');
console.log('✅ Backup do JSON foi criado');
console.log('✅ Sistema está funcionando corretamente');
console.log('');

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  console.log('📁 Pasta uploads não encontrada');
  process.exit(0);
}

// Listar arquivos
const files = fs.readdirSync(uploadsDir);
const videoFiles = files.filter(file => file.toLowerCase().match(/\.(mp4|avi|mov|wmv)$/));
const imageFiles = files.filter(file => file.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/));
const docFiles = files.filter(file => file.toLowerCase().match(/\.(pdf|doc|docx)$/));

console.log('📊 ARQUIVOS ENCONTRADOS:');
console.log(`   🎬 Vídeos: ${videoFiles.length}`);
console.log(`   🖼️  Imagens: ${imageFiles.length}`);
console.log(`   📄 Documentos: ${docFiles.length}`);
console.log(`   📁 Total: ${files.length}`);
console.log('');

// Calcular tamanho total
let totalSize = 0;
files.forEach(file => {
  const filePath = path.join(uploadsDir, file);
  const stats = fs.statSync(filePath);
  totalSize += stats.size;
});

const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
console.log(`💾 Tamanho total: ${sizeInMB} MB`);
console.log('');

console.log('🤔 OPÇÕES DISPONÍVEIS:');
console.log('=====================');
console.log('1. Criar backup antes de excluir (RECOMENDADO)');
console.log('2. Excluir apenas vídeos');
console.log('3. Excluir todos os arquivos');
console.log('4. Cancelar');
console.log('');

// Função para criar backup
function createBackup() {
  const backupDir = path.join(__dirname, '..', 'backup-uploads');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  console.log('💾 Criando backup...');
  
  files.forEach(file => {
    const srcPath = path.join(uploadsDir, file);
    const destPath = path.join(backupDir, file);
    fs.copyFileSync(srcPath, destPath);
  });
  
  console.log(`✅ Backup criado em: ${backupDir}`);
  console.log(`📁 ${files.length} arquivos copiados`);
}

// Função para excluir apenas vídeos
function deleteVideos() {
  console.log('🎬 Excluindo apenas vídeos...');
  let deletedCount = 0;
  
  videoFiles.forEach(file => {
    const filePath = path.join(uploadsDir, file);
    try {
      fs.unlinkSync(filePath);
      deletedCount++;
      console.log(`   ✅ ${file}`);
    } catch (error) {
      console.log(`   ❌ Erro ao excluir ${file}: ${error.message}`);
    }
  });
  
  console.log(`✅ ${deletedCount} vídeos excluídos`);
}

// Função para excluir todos os arquivos
function deleteAllFiles() {
  console.log('🗑️  Excluindo todos os arquivos...');
  let deletedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(uploadsDir, file);
    try {
      fs.unlinkSync(filePath);
      deletedCount++;
      console.log(`   ✅ ${file}`);
    } catch (error) {
      console.log(`   ❌ Erro ao excluir ${file}: ${error.message}`);
    }
  });
  
  console.log(`✅ ${deletedCount} arquivos excluídos`);
}

// Simular entrada do usuário (em um ambiente real, você usaria readline)
console.log('💡 EXECUTE UMA DAS OPÇÕES:');
console.log('');
console.log('// Para criar backup:');
console.log('node -e "require(\'./scripts/cleanup-local-files.js\').createBackup()"');
console.log('');
console.log('// Para excluir apenas vídeos:');
console.log('node -e "require(\'./scripts/cleanup-local-files.js\').deleteVideos()"');
console.log('');
console.log('// Para excluir todos os arquivos:');
console.log('node -e "require(\'./scripts/cleanup-local-files.js\').deleteAllFiles()"');
console.log('');

// Exportar funções para uso via linha de comando
module.exports = {
  createBackup,
  deleteVideos,
  deleteAllFiles
};
