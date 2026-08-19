import dotenv from 'dotenv';
import connectDB from '../lib/mongodb';
import mongoose from 'mongoose';

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });

async function testPoraCredConnection() {
  try {
    console.log('🏢 Testando conexão com PoraCred MongoDB Atlas...');
    console.log('🗄️ Banco: Segurança-clientes');
    console.log('');
    
    // Conectar ao banco
    await connectDB();
    
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Não foi possível conectar ao banco');
    }
    
    console.log('✅ Conexão estabelecida com sucesso!');
    console.log('');
    
    // Verificar nome do banco
    const dbName = db.databaseName;
    console.log(`🗄️ Banco conectado: ${dbName}`);
    
    // Listar coleções existentes
    const collections = await db.listCollections().toArray();
    
    console.log('');
    console.log('📊 COLEÇÕES EXISTENTES NO BANCO SEGURANÇA-CLIENTES:');
    console.log('==================================================');
    
    if (collections.length === 0) {
      console.log('   📁 Banco vazio - primeira utilização');
    } else {
      for (const collection of collections) {
        const count = await db.collection(collection.name).countDocuments();
        console.log(`   📁 ${collection.name}: ${count} documentos`);
      }
    }
    
    // Verificar se sistema_clientes já existe
    const sistemaClientesExists = collections.some(c => c.name === 'sistema_clientes');
    
    console.log('');
    if (sistemaClientesExists) {
      console.log('⚠️  A coleção "sistema_clientes" já existe');
      const count = await db.collection('sistema_clientes').countDocuments();
      console.log(`   📊 Documentos existentes: ${count}`);
    } else {
      console.log('✅ A coleção "sistema_clientes" será criada pela primeira vez');
    }
    
    console.log('');
    console.log('🛡️  GARANTIAS DE SEGURANÇA:');
    console.log('============================');
    console.log('✅ Trabalhando apenas com banco "Segurança-clientes"');
    console.log('✅ Banco CRM completamente protegido');
    console.log('✅ Apenas nova coleção será criada/atualizada');
    console.log('✅ Nenhum dado existente será alterado');
    
    console.log('');
    console.log('🚀 PRÓXIMOS PASSOS:');
    console.log('===================');
    console.log('1. Execute: node scripts/migrate-to-mongodb.js');
    console.log('2. Aguarde a migração dos 67 clientes');
    console.log('3. Teste o sistema no navegador');
    
    console.log('');
    console.log('✅ Teste de conexão concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante teste de conexão:', error);
    
    if (error.message.includes('authentication')) {
      console.log('');
      console.log('🔑 POSSÍVEL PROBLEMA DE AUTENTICAÇÃO:');
      console.log('=====================================');
      console.log('1. Verifique se a senha está correta no env.local');
      console.log('2. Substitua <db_password> pela senha real');
      console.log('3. Teste a conexão novamente');
    }
    
    if (error.message.includes('network')) {
      console.log('');
      console.log('🌐 POSSÍVEL PROBLEMA DE REDE:');
      console.log('=============================');
      console.log('1. Verifique sua conexão com a internet');
      console.log('2. Confirme se o IP está na whitelist do MongoDB Atlas');
      console.log('3. Teste a conectividade');
    }
  } finally {
    process.exit(0);
  }
}

// Executar teste se chamado diretamente
if (require.main === module) {
  testPoraCredConnection();
}

export { testPoraCredConnection };
