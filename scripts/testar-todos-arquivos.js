import { readFileSync } from 'fs';
import { join } from 'path';
import { MongoClient } from 'mongodb';
import { existsSync } from 'fs';

// Ler .env.local manualmente
const envPath = join(process.cwd(), '.env.local');
let mongoUri = '';

try {
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').trim();
      if (key.trim() === 'MONGODB_URI') {
        mongoUri = value;
      }
    }
  });
} catch (err) {
  console.log('⚠️ Não foi possível ler .env.local');
}

if (!mongoUri) {
  console.error('❌ MONGODB_URI não encontrado no .env.local');
  process.exit(1);
}

console.log('========================================');
console.log('  Testar Todos os Arquivos');
console.log('========================================\n');

async function testarArquivos() {
  const client = new MongoClient(mongoUri);
  
  try {
    await client.connect();
    console.log('✅ Conectado ao MongoDB\n');
    
    const db = client.db();
    const collection = db.collection('sistema_clientes');
    
    // Buscar clientes com anexos locais (não Cloudinary)
    const clientes = await collection.find({ 
      anexos: { $exists: true, $ne: [] },
      'anexos.url': { $not: { $regex: '^http' } }
    }).limit(10).toArray();
    
    console.log(`📊 Encontrados ${clientes.length} clientes com anexos locais\n`);
    
    const resultados = [];
    
    for (const cliente of clientes) {
      if (cliente.anexos && cliente.anexos.length > 0) {
        for (const anexo of cliente.anexos) {
          if (!anexo.url.startsWith('http')) {
            // Extrair nome do arquivo da URL
            const urlParts = anexo.url.split('/');
            const fileName = urlParts[urlParts.length - 1];
            
            // Verificar se arquivo existe
            const caminhosPossiveis = [
              join(process.cwd(), 'public', 'uploads', fileName),
              join('C:', 'Dados Segurança', fileName),
              join('C:', 'Dados Segurança', 'uploads', fileName),
              join('C:', 'Dados Segurança', 'videos', fileName),
            ];
            
            let encontrado = false;
            let caminhoEncontrado = null;
            
            for (const caminho of caminhosPossiveis) {
              if (existsSync(caminho)) {
                encontrado = true;
                caminhoEncontrado = caminho;
                break;
              }
            }
            
            resultados.push({
              cliente: cliente.nome,
              anexoNome: anexo.nome,
              url: anexo.url,
              fileName: fileName,
              encontrado: encontrado,
              caminho: caminhoEncontrado
            });
          }
        }
      }
    }
    
    // Mostrar resultados
    console.log('📋 Resultados:\n');
    resultados.forEach((resultado, index) => {
      console.log(`${index + 1}. Cliente: ${resultado.cliente}`);
      console.log(`   Anexo: ${resultado.anexoNome}`);
      console.log(`   URL: ${resultado.url}`);
      console.log(`   Nome do arquivo: ${resultado.fileName}`);
      if (resultado.encontrado) {
        console.log(`   ✅ ENCONTRADO: ${resultado.caminho}`);
      } else {
        console.log(`   ❌ NÃO ENCONTRADO`);
      }
      console.log();
    });
    
    // Estatísticas
    const encontrados = resultados.filter(r => r.encontrado).length;
    const naoEncontrados = resultados.filter(r => !r.encontrado).length;
    
    console.log('\n========================================');
    console.log('📊 Estatísticas:');
    console.log(`   ✅ Encontrados: ${encontrados}`);
    console.log(`   ❌ Não encontrados: ${naoEncontrados}`);
    console.log(`   📁 Total: ${resultados.length}`);
    console.log('========================================\n');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.close();
  }
}

testarArquivos();

