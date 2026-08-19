import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { MongoClient } from 'mongodb';

function findFileLocal(filename) {
  const caminhos = [
    join(process.cwd(), 'public', 'uploads', filename),
    join('C:', 'Dados Segurança', filename),
  ];
  
  for (const caminho of caminhos) {
    if (existsSync(caminho)) {
      return { path: caminho };
    }
  }
  
  // Busca flexível
  for (const caminhoBase of caminhos) {
    if (existsSync(caminhoBase.replace(filename, ''))) {
      try {
        const arquivos = readdirSync(caminhoBase.replace(filename, ''));
        const nomeSemTimestamp = filename.replace(/^\d+-/, '').toLowerCase();
        const arquivoEncontrado = arquivos.find(arquivo => {
          const arquivoLower = arquivo.toLowerCase();
          return arquivoLower.includes(nomeSemTimestamp.replace(/_/g, ' ')) ||
                 arquivoLower.includes(nomeSemTimestamp.replace(/\s/g, '_'));
        });
        
        if (arquivoEncontrado) {
          return { path: join(caminhoBase.replace(filename, ''), arquivoEncontrado) };
        }
      } catch (err) {
        // Ignorar
      }
    }
  }
  
  return { path: null };
}

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
console.log('  Verificar Arquivos Faltando');
console.log('========================================\n');

async function verificarArquivos() {
  const client = new MongoClient(mongoUri);
  
  try {
    await client.connect();
    console.log('✅ Conectado ao MongoDB\n');
    
    const db = client.db();
    const collection = db.collection('sistema_clientes');
    
    // Buscar todos os clientes com anexos locais
    const clientes = await collection.find({ 
      anexos: { $exists: true, $ne: [] },
      'anexos.url': { $not: { $regex: '^http' } }
    }).toArray();
    
    console.log(`📊 Encontrados ${clientes.length} clientes com anexos locais\n`);
    
    const arquivosFaltando = [];
    const arquivosEncontrados = [];
    
    for (const cliente of clientes) {
      if (cliente.anexos && cliente.anexos.length > 0) {
        for (const anexo of cliente.anexos) {
          if (!anexo.url.startsWith('http')) {
            // Extrair nome do arquivo da URL
            const urlParts = anexo.url.split('/');
            const fileName = urlParts[urlParts.length - 1];
            
            // Tentar encontrar o arquivo
            const { path: filePath } = findFileLocal(fileName);
            
            if (filePath && existsSync(filePath)) {
              arquivosEncontrados.push({
                cliente: cliente.nome,
                anexoNome: anexo.nome,
                fileName: fileName,
                caminho: filePath
              });
            } else {
              arquivosFaltando.push({
                cliente: cliente.nome,
                anexoNome: anexo.nome,
                url: anexo.url,
                fileName: fileName
              });
            }
          }
        }
      }
    }
    
    // Mostrar resultados
    console.log('✅ Arquivos Encontrados:', arquivosEncontrados.length);
    console.log('❌ Arquivos Faltando:', arquivosFaltando.length);
    console.log();
    
    if (arquivosFaltando.length > 0) {
      console.log('❌ ARQUIVOS FALTANDO:\n');
      arquivosFaltando.forEach((item, index) => {
        console.log(`${index + 1}. Cliente: ${item.cliente}`);
        console.log(`   Anexo: ${item.anexoNome}`);
        console.log(`   URL: ${item.url}`);
        console.log(`   Nome do arquivo: ${item.fileName}`);
        console.log();
      });
    }
    
    // Verificar se há arquivos similares
    if (arquivosFaltando.length > 0) {
      console.log('\n🔍 Procurando arquivos similares...\n');
      
      const pastaUploads = join(process.cwd(), 'public', 'uploads');
      if (existsSync(pastaUploads)) {
        const arquivosNaPasta = readdirSync(pastaUploads);
        
        arquivosFaltando.slice(0, 5).forEach(item => {
          const nomeSemTimestamp = item.fileName.replace(/^\d+-/, '').toLowerCase();
          const arquivosSimilares = arquivosNaPasta.filter(arquivo => {
            const arquivoLower = arquivo.toLowerCase();
            return arquivoLower.includes(nomeSemTimestamp.replace(/_/g, ' ')) ||
                   arquivoLower.includes(nomeSemTimestamp.replace(/\s/g, '_'));
          });
          
          if (arquivosSimilares.length > 0) {
            console.log(`📁 Arquivos similares para "${item.fileName}":`);
            arquivosSimilares.slice(0, 3).forEach(arquivo => {
              console.log(`   - ${arquivo}`);
            });
            console.log();
          }
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.close();
  }
}

verificarArquivos();

