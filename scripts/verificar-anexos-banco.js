import { readFileSync } from 'fs';
import { join } from 'path';
import { MongoClient } from 'mongodb';

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
console.log('  Verificar Anexos no Banco');
console.log('========================================\n');

async function verificarAnexos() {
  const client = new MongoClient(mongoUri);
  
  try {
    await client.connect();
    console.log('✅ Conectado ao MongoDB\n');
    
    const db = client.db();
    
    // Listar todas as coleções
    const collections = await db.listCollections().toArray();
    console.log('📋 Coleções encontradas:');
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    console.log();
    
    // Tentar diferentes nomes de coleção
    const possibleCollections = ['sistema_clientes', 'clientes', 'Cliente', 'Clientes', 'cliente'];
    let collection = null;
    let collectionName = null;
    
    for (const colName of possibleCollections) {
      try {
        const col = db.collection(colName);
        const count = await col.countDocuments();
        if (count > 0) {
          collection = col;
          collectionName = colName;
          console.log(`✅ Usando coleção: ${colName} (${count} documentos)\n`);
          break;
        }
      } catch (e) {
        // Continuar
      }
    }
    
    if (!collection) {
      console.log('❌ Nenhuma coleção de clientes encontrada');
      return;
    }
    
    // Buscar clientes com anexos
    const clientes = await collection.find({ anexos: { $exists: true, $ne: [] } }).limit(5).toArray();
    
    console.log(`📊 Encontrados ${clientes.length} clientes com anexos\n`);
    
    // Se não encontrou com anexos, buscar qualquer cliente
    if (clientes.length === 0) {
      const qualquerCliente = await collection.find({}).limit(1).toArray();
      if (qualquerCliente.length > 0) {
        console.log('📋 Estrutura de um cliente (sem anexos):');
        console.log(JSON.stringify(qualquerCliente[0], null, 2));
      }
    }
    
    clientes.forEach((cliente, index) => {
      console.log(`\n${index + 1}. Cliente: ${cliente.nome}`);
      console.log(`   Anexos: ${cliente.anexos?.length || 0}`);
      
      if (cliente.anexos && cliente.anexos.length > 0) {
        cliente.anexos.slice(0, 3).forEach((anexo, anexoIndex) => {
          console.log(`\n   Anexo ${anexoIndex + 1}:`);
          console.log(`      nome: "${anexo.nome}"`);
          console.log(`      url: "${anexo.url}"`);
          console.log(`      tipo: ${anexo.tipo}`);
          
          // Extrair nome do arquivo da URL
          if (anexo.url && !anexo.url.startsWith('http')) {
            const urlParts = anexo.url.split('/');
            const fileNameFromUrl = urlParts[urlParts.length - 1];
            console.log(`      nome da URL: "${fileNameFromUrl}"`);
            console.log(`      nome vs URL: ${anexo.nome === fileNameFromUrl ? '✅ IGUAIS' : '❌ DIFERENTES'}`);
          }
        });
      }
    });
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.close();
  }
}

verificarAnexos();

