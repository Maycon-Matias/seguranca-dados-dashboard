require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function viewVideosInDatabase() {
  try {
    console.log('🎬 Visualizando Vídeos no Banco de Dados');
    console.log('=======================================');
    console.log('');
    
    // Conectar ao banco
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI não encontrada');
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB Atlas - PoraCred');
    console.log('🗄️ Banco: Segurança-clientes');
    console.log('');
    
    // Buscar todos os clientes com vídeos
    const clientes = await mongoose.connection.db.collection('sistema_clientes').find({}).toArray();
    
    console.log(`📊 Total de clientes no banco: ${clientes.length}`);
    console.log('');
    
    // Contar vídeos
    let totalVideos = 0;
    let clientesComVideos = 0;
    
    console.log('🎬 CLIENTES COM VÍDEOS:');
    console.log('=======================');
    
    clientes.forEach((cliente, index) => {
      if (cliente.anexos && cliente.anexos.length > 0) {
        const videos = cliente.anexos.filter(anexo => anexo.tipo === 'video');
        
        if (videos.length > 0) {
          clientesComVideos++;
          totalVideos += videos.length;
          
          console.log(`\n${clientesComVideos}. ${cliente.nome}`);
          console.log(`   📅 Cadastro: ${new Date(cliente.dataCadastro).toLocaleDateString('pt-BR')}`);
          console.log(`   📎 Anexos: ${videos.length} vídeo(s)`);
          
          videos.forEach((video, videoIndex) => {
            const sizeInMB = (video.tamanho / (1024 * 1024)).toFixed(2);
            console.log(`      ${videoIndex + 1}. ${video.nome}`);
            console.log(`         📏 Tamanho: ${sizeInMB} MB`);
            console.log(`         🔗 URL: ${video.url}`);
            console.log(`         📅 Upload: ${new Date(video.dataUpload).toLocaleDateString('pt-BR')}`);
          });
        }
      }
    });
    
    console.log('\n📊 ESTATÍSTICAS:');
    console.log('=================');
    console.log(`👥 Total de clientes: ${clientes.length}`);
    console.log(`🎬 Clientes com vídeos: ${clientesComVideos}`);
    console.log(`📹 Total de vídeos: ${totalVideos}`);
    
    // Calcular tamanho total dos vídeos
    let totalSize = 0;
    clientes.forEach(cliente => {
      if (cliente.anexos) {
        cliente.anexos.forEach(anexo => {
          if (anexo.tipo === 'video') {
            totalSize += anexo.tamanho;
          }
        });
      }
    });
    
    const totalSizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
    console.log(`💾 Tamanho total dos vídeos: ${totalSizeInMB} MB`);
    
    console.log('\n🌐 COMO ACESSAR OS VÍDEOS:');
    console.log('===========================');
    console.log('1. Via sistema web:');
    console.log('   - Execute: npm run dev');
    console.log('   - Acesse: http://localhost:3000');
    console.log('   - Clique em um cliente para ver os vídeos');
    console.log('');
    console.log('2. Via URLs diretas:');
    console.log('   - Os vídeos têm URLs únicas no banco');
    console.log('   - Podem ser acessados diretamente pelo navegador');
    console.log('');
    console.log('3. Via MongoDB Atlas:');
    console.log('   - Acesse o dashboard do MongoDB Atlas');
    console.log('   - Navegue até a coleção sistema_clientes');
    console.log('   - Visualize os documentos com os URLs dos vídeos');
    
    console.log('\n✅ Visualização concluída!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

viewVideosInDatabase();
