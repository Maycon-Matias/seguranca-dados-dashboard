import { readFileSync } from 'fs';
import { join } from 'path';

// Ler .env.local manualmente
const envPath = join(process.cwd(), '.env.local');
let envVars = {};

try {
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').trim();
      envVars[key.trim()] = value;
    }
  });
} catch (err) {
  console.log('⚠️ Não foi possível ler .env.local');
}

// Nome do arquivo para testar
const filename = process.argv[2] || 'VIRGILIO GONZALEZ RG FRENTE.jpg';

console.log('========================================');
console.log('  Teste de API de Arquivo');
console.log('========================================\n');

console.log(`📄 Arquivo para testar: ${filename}\n`);

// Testar URL da API
const baseUrl = 'http://localhost:3002';
const encodedFilename = encodeURIComponent(filename);
const apiUrl = `${baseUrl}/api/uploads/${encodedFilename}`;

console.log(`🔗 URL da API: ${apiUrl}\n`);

// Fazer requisição
try {
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Accept': '*/*'
    }
  });

  console.log(`📊 Status: ${response.status} ${response.statusText}`);
  console.log(`📋 Headers:`);
  response.headers.forEach((value, key) => {
    console.log(`   ${key}: ${value}`);
  });

  if (response.ok) {
    const contentType = response.headers.get('content-type');
    console.log(`\n✅ Arquivo encontrado!`);
    console.log(`   Content-Type: ${contentType}`);
    console.log(`   Content-Length: ${response.headers.get('content-length')} bytes`);
    
    // Tentar ler o conteúdo (apenas para verificar)
    const buffer = await response.arrayBuffer();
    console.log(`   Tamanho recebido: ${buffer.byteLength} bytes`);
  } else {
    const errorText = await response.text();
    console.log(`\n❌ Erro: ${errorText}`);
    
    try {
      const errorJson = JSON.parse(errorText);
      console.log(`\n📋 Detalhes do erro:`);
      console.log(JSON.stringify(errorJson, null, 2));
    } catch (e) {
      // Não é JSON
    }
  }
} catch (error) {
  console.error(`\n❌ Erro ao fazer requisição:`, error.message);
  console.log(`\n💡 Verifique se o servidor está rodando em ${baseUrl}`);
}

console.log('\n========================================');

