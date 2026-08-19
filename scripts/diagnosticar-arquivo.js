// Script para diagnosticar por que um arquivo não é encontrado
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Obter nome do arquivo como argumento
const filename = process.argv[2];

if (!filename) {
  console.log("Uso: node diagnosticar-arquivo.js [nome-do-arquivo]");
  console.log("Exemplo: node diagnosticar-arquivo.js 1757526797756-Frente_RG_Amadeu.jpg");
  process.exit(1);
}

console.log("========================================");
console.log("  Diagnostico de Arquivo");
console.log("========================================");
console.log(`\n🔍 Procurando arquivo: ${filename}\n`);

// Locais possíveis
const possiveisCaminhos = [
  join(process.cwd(), 'public', 'uploads', filename),
  join('C:', 'Dados Segurança', filename),
  join('C:', 'Dados Seguranca', filename),
  join('C:', 'Dados Segurança', 'uploads', filename),
  join('C:', 'Dados Seguranca', 'uploads', filename),
];

let encontrado = false;

console.log("📁 Verificando locais:\n");
possiveisCaminhos.forEach((caminho, index) => {
  const existe = existsSync(caminho);
  const status = existe ? '✅ ENCONTRADO' : '❌ Não encontrado';
  console.log(`${index + 1}. ${status}`);
  console.log(`   ${caminho}\n`);
  
  if (existe) {
    encontrado = true;
    const stats = require('fs').statSync(caminho);
    console.log(`   📊 Tamanho: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   📅 Modificado: ${stats.mtime}\n`);
  }
});

if (!encontrado) {
  console.log("❌ Arquivo não encontrado em nenhum local!\n");
  
  // Listar o que existe nas pastas
  console.log("📋 Verificando conteúdo das pastas:\n");
  
  const pastasParaVerificar = [
    join(process.cwd(), 'public', 'uploads'),
    join('C:', 'Dados Segurança'),
    join('C:', 'Dados Seguranca'),
  ];
  
  pastasParaVerificar.forEach(pasta => {
    if (existsSync(pasta)) {
      try {
        const arquivos = readdirSync(pasta);
        console.log(`📁 ${pasta}:`);
        console.log(`   Total de arquivos: ${arquivos.length}`);
        
        // Procurar arquivos similares
        const similares = arquivos.filter(arquivo => 
          arquivo.toLowerCase().includes(filename.toLowerCase().substring(0, 10)) ||
          filename.toLowerCase().includes(arquivo.toLowerCase().substring(0, 10))
        );
        
        if (similares.length > 0) {
          console.log(`   ⚠️  Arquivos similares encontrados:`);
          similares.slice(0, 5).forEach(arquivo => {
            console.log(`      - ${arquivo}`);
          });
        }
        
        // Mostrar alguns exemplos
        console.log(`   📄 Exemplos de arquivos na pasta:`);
        arquivos.slice(0, 5).forEach(arquivo => {
          console.log(`      - ${arquivo}`);
        });
        console.log("");
      } catch (err) {
        console.log(`   ❌ Erro ao listar: ${err.message}\n`);
      }
    } else {
      console.log(`❌ Pasta não existe: ${pasta}\n`);
    }
  });
  
  console.log("\n💡 Dicas:");
  console.log("   1. Verifique se o nome do arquivo está correto");
  console.log("   2. Verifique se o arquivo está em uma das pastas listadas");
  console.log("   3. Verifique se há diferenças no nome (maiúsculas/minúsculas, espaços, etc)");
}

console.log("\n========================================");

