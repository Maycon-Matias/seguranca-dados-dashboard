import { findFile } from '../lib/file-paths.js';

const filename = '1762269625501-VIRGILIO_GONZALEZ.mp4';

console.log('========================================');
console.log('  Teste da Função findFile');
console.log('========================================\n');

console.log(`🔍 Procurando: ${filename}\n`);

const resultado = findFile(filename);

if (resultado.path) {
  console.log(`✅ ARQUIVO ENCONTRADO!`);
  console.log(`   Caminho: ${resultado.path}`);
  console.log(`   Procurado: ${filename}`);
} else {
  console.log(`❌ Arquivo não encontrado`);
  console.log(`\n📁 Locais verificados:`);
  resultado.searchedPaths.forEach((caminho, index) => {
    console.log(`   ${index + 1}. ${caminho}`);
  });
}

console.log('\n========================================');

