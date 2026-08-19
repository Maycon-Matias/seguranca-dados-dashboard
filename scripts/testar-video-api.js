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

const filename = process.argv[2] || 'MARIA_INES.mp4';
const baseUrl = 'http://localhost:3002';
const encodedFilename = encodeURIComponent(filename);
const apiUrl = `${baseUrl}/api/uploads/${encodedFilename}`;

console.log('========================================');
console.log('  Teste de API de Vídeo');
console.log('========================================\n');

console.log(`📄 Arquivo: ${filename}`);
console.log(`🔗 URL: ${apiUrl}\n`);

try {
  // Teste 1: HEAD request
  console.log('1️⃣ Testando HEAD request...');
  const headResponse = await fetch(apiUrl, { method: 'HEAD' });
  console.log(`   Status: ${headResponse.status} ${headResponse.statusText}`);
  console.log(`   Content-Type: ${headResponse.headers.get('content-type')}`);
  console.log(`   Content-Length: ${headResponse.headers.get('content-length')}`);
  console.log(`   Accept-Ranges: ${headResponse.headers.get('accept-ranges')}`);
  console.log();

  if (!headResponse.ok) {
    console.error('❌ HEAD request falhou!');
    process.exit(1);
  }

  // Teste 2: GET request (primeiros bytes)
  console.log('2️⃣ Testando GET request (primeiros 1024 bytes)...');
  const getResponse = await fetch(apiUrl, {
    headers: {
      'Range': 'bytes=0-1023'
    }
  });
  
  console.log(`   Status: ${getResponse.status} ${getResponse.statusText}`);
  console.log(`   Content-Range: ${getResponse.headers.get('content-range')}`);
  console.log(`   Content-Length: ${getResponse.headers.get('content-length')}`);
  
  if (getResponse.ok || getResponse.status === 206) {
    const buffer = await getResponse.arrayBuffer();
    console.log(`   Bytes recebidos: ${buffer.byteLength}`);
    
    // Verificar se é um MP4 válido (deve começar com ftyp)
    const uint8Array = new Uint8Array(buffer);
    const signature = String.fromCharCode(...uint8Array.slice(4, 8));
    console.log(`   Assinatura MP4: ${signature}`);
    
    if (signature === 'ftyp') {
      console.log('   ✅ Arquivo parece ser um MP4 válido');
    } else {
      console.log('   ⚠️ Arquivo pode não ser um MP4 válido');
    }
  } else {
    console.error(`   ❌ GET request falhou: ${getResponse.status}`);
  }
  console.log();

  // Teste 3: GET request completo (pequeno)
  const contentLength = parseInt(headResponse.headers.get('content-length') || '0');
  if (contentLength < 10 * 1024 * 1024) { // Menor que 10MB
    console.log('3️⃣ Testando GET request completo...');
    const fullResponse = await fetch(apiUrl);
    
    if (fullResponse.ok) {
      const buffer = await fullResponse.arrayBuffer();
      console.log(`   ✅ Arquivo completo recebido: ${buffer.byteLength} bytes`);
      
      // Verificar estrutura MP4
      const uint8Array = new Uint8Array(buffer);
      const firstBytes = Array.from(uint8Array.slice(0, 20))
        .map(b => b.toString(16).padStart(2, '0'))
        .join(' ');
      console.log(`   Primeiros bytes (hex): ${firstBytes}`);
    } else {
      console.error(`   ❌ Falhou: ${fullResponse.status}`);
    }
  } else {
    console.log('3️⃣ Arquivo muito grande, pulando teste completo');
  }

} catch (error) {
  console.error(`\n❌ Erro: ${error.message}`);
  console.log(`\n💡 Verifique se o servidor está rodando em ${baseUrl}`);
}

console.log('\n========================================');

