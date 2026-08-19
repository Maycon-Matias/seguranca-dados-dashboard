// Script para verificar arquivos e URLs no banco de dados
import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente
let mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  try {
    const envFile = readFileSync(join(__dirname, '../.env.local'), 'utf8');
    const mongoMatch = envFile.match(/MONGODB_URI=(.+)/);
    if (mongoMatch) {
      mongoUri = mongoMatch[1].trim();
    }
  } catch (err) {
    // Arquivo não existe
  }
}

const uri = mongoUri || "mongodb+srv://admin:admin123@poracred.lep058a.mongodb.net/Segurança-clientes?retryWrites=true&w=majority&appName=PoraCred";

console.log("========================================");
console.log("  Verificação de Arquivos e URLs");
console.log("========================================");

let client;

try {
  client = new MongoClient(uri);
  await client.connect();
  console.log("✅ Conectado ao MongoDB\n");

  const db = client.db("Segurança-clientes");
  const collection = db.collection("sistema_clientes");

  const clientes = await collection.find({}).toArray();
  console.log(`📊 Total de clientes: ${clientes.length}\n`);

  let totalAnexos = 0;
  let cloudinaryUrls = 0;
  let localUrls = 0;
  let arquivosNaoEncontrados = 0;
  let arquivosEncontrados = 0;

  const uploadsDir = join(process.cwd(), 'public', 'uploads');

  console.log("🔍 Verificando anexos...\n");

  for (const cliente of clientes) {
    if (cliente.anexos && Array.isArray(cliente.anexos)) {
      for (const anexo of cliente.anexos) {
        totalAnexos++;
        
        if (anexo.url) {
          if (anexo.url.includes('cloudinary.com')) {
            cloudinaryUrls++;
            console.log(`☁️  Cloudinary: ${cliente.nome} - ${anexo.nome}`);
          } else if (anexo.url.startsWith('/uploads/')) {
            localUrls++;
            const fileName = anexo.url.replace('/uploads/', '');
            const filePath = join(uploadsDir, fileName);
            
            if (existsSync(filePath)) {
              arquivosEncontrados++;
            } else {
              arquivosNaoEncontrados++;
              console.log(`❌ Arquivo não encontrado: ${fileName} (Cliente: ${cliente.nome})`);
            }
          } else {
            console.log(`⚠️  URL desconhecida: ${anexo.url} (Cliente: ${cliente.nome})`);
          }
        }
      }
    }
  }

  console.log("\n========================================");
  console.log("  Resumo:");
  console.log("========================================");
  console.log(`Total de anexos: ${totalAnexos}`);
  console.log(`URLs Cloudinary: ${cloudinaryUrls}`);
  console.log(`URLs locais: ${localUrls}`);
  console.log(`Arquivos encontrados: ${arquivosEncontrados}`);
  console.log(`Arquivos NÃO encontrados: ${arquivosNaoEncontrados}`);
  console.log("========================================\n");

  if (arquivosNaoEncontrados > 0) {
    console.log("⚠️  ATENÇÃO: Alguns arquivos não foram encontrados!");
    console.log("   Isso pode causar erro 404 ao tentar visualizar.\n");
  }

  if (cloudinaryUrls > 0) {
    console.log("💡 DICA: Você tem arquivos no Cloudinary.");
    console.log("   Configure as credenciais no .env.local para que funcionem.\n");
  }

} catch (error) {
  console.error("❌ Erro:", error);
} finally {
  if (client) {
    await client.close();
  }
}

