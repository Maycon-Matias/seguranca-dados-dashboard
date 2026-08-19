// Script para listar todos os arquivos na pasta C:\Dados Segurança
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const pasta = 'C:\\Dados Segurança';

console.log("========================================");
console.log("  Listando Arquivos na Pasta");
console.log("========================================");
console.log(`\n📁 Pasta: ${pasta}\n`);

try {
  const arquivos = readdirSync(pasta);
  console.log(`📊 Total de arquivos: ${arquivos.length}\n`);
  
  // Procurar arquivos relacionados a VIRGILIO
  const relacionados = arquivos.filter(arquivo => 
    arquivo.toLowerCase().includes('virgilio') ||
    arquivo.toLowerCase().includes('gonzalez') ||
    arquivo.includes('1762269625501')
  );
  
  if (relacionados.length > 0) {
    console.log("🔍 Arquivos relacionados a VIRGILIO_GONZALEZ:");
    relacionados.forEach(arquivo => {
      const caminho = join(pasta, arquivo);
      const stats = statSync(caminho);
      console.log(`   - ${arquivo} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    });
    console.log("");
  } else {
    console.log("❌ Nenhum arquivo relacionado encontrado\n");
  }
  
  // Mostrar todos os arquivos (primeiros 50)
  console.log("📋 Todos os arquivos (primeiros 50):");
  arquivos.slice(0, 50).forEach((arquivo, index) => {
    console.log(`   ${index + 1}. ${arquivo}`);
  });
  
  if (arquivos.length > 50) {
    console.log(`   ... e mais ${arquivos.length - 50} arquivos`);
  }
  
  // Verificar se há subpastas
  const itens = readdirSync(pasta, { withFileTypes: true });
  const subpastas = itens.filter(item => item.isDirectory());
  
  if (subpastas.length > 0) {
    console.log(`\n📁 Subpastas encontradas (${subpastas.length}):`);
    subpastas.forEach(subpasta => {
      console.log(`   - ${subpasta.name}`);
      try {
        const arquivosSub = readdirSync(join(pasta, subpasta.name));
        console.log(`     Arquivos: ${arquivosSub.length}`);
      } catch (err) {
        console.log(`     Erro ao listar: ${err.message}`);
      }
    });
  }
  
} catch (error) {
  console.error("❌ Erro:", error.message);
  console.error("\n💡 Verifique:");
  console.error("   1. Se a pasta existe");
  console.error("   2. Se você tem permissão para acessar");
  console.error("   3. Se o caminho está correto");
}

console.log("\n========================================");

