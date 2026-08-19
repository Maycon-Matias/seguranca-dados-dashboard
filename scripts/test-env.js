require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testando carregamento de variáveis de ambiente...');
console.log('');

const mongoUri = process.env.MONGODB_URI;

if (mongoUri) {
  console.log('✅ MONGODB_URI carregada com sucesso!');
  console.log('');
  console.log('📊 Detalhes da conexão:');
  console.log('========================');
  
  // Extrair informações da URI
  const uriParts = mongoUri.split('@');
  if (uriParts.length > 1) {
    const serverPart = uriParts[1].split('/')[0];
    const dbPart = uriParts[1].split('/')[1]?.split('?')[0];
    
    console.log(`🌐 Servidor: ${serverPart}`);
    console.log(`🗄️ Banco: ${dbPart || 'Não especificado'}`);
    console.log(`🔑 Autenticação: Configurada`);
  }
  
  // Mascarar a URI para segurança
  const maskedUri = mongoUri.replace(/admin:[^@]+@/, 'admin:***@');
  console.log(`📝 URI: ${maskedUri}`);
  
} else {
  console.log('❌ MONGODB_URI não encontrada!');
  console.log('');
  console.log('🔧 Possíveis soluções:');
  console.log('1. Verifique se o arquivo .env.local existe');
  console.log('2. Verifique se a linha MONGODB_URI está presente');
  console.log('3. Verifique se não há espaços extras');
}

console.log('');
console.log('📁 Arquivo .env.local encontrado:', require('fs').existsSync('.env.local'));
