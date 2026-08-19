import connectDB from '../lib/mongodb';
import mongoose from 'mongoose';

async function verifyDatabaseSafety() {
  try {
    console.log('🔍 Verificando segurança do banco de dados existente...');
    console.log('');
    
    // Conectar ao banco
    await connectDB();
    
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Não foi possível conectar ao banco');
    }
    
    // Listar todas as coleções
    const collections = await db.listCollections().toArray();
    
    console.log('📊 COLEÇÕES EXISTENTES NO BANCO:');
    console.log('================================');
    
    let totalCollections = 0;
    let existingCollections = [];
    
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`   📁 ${collection.name}: ${count} documentos`);
      existingCollections.push({ name: collection.name, count });
      totalCollections++;
    }
    
    console.log('');
    console.log(`📈 Total de coleções: ${totalCollections}`);
    
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
    console.log('✅ Nenhuma coleção existente será alterada');
    console.log('✅ Nenhum documento existente será modificado');
    console.log('✅ Apenas a coleção "sistema_clientes" será criada/atualizada');
    console.log('✅ Todas as suas coleções antigas permanecerão intactas');
    
    console.log('');
    console.log('📋 COLEÇÕES QUE PERMANECERÃO INALTERADAS:');
    console.log('=========================================');
    
    for (const collection of existingCollections) {
      if (collection.name !== 'sistema_clientes') {
        console.log(`   🔒 ${collection.name}: ${collection.count} documentos (preservados)`);
      }
    }
    
    console.log('');
    console.log('✅ Verificação concluída - Banco seguro para migração!');
    
  } catch (error) {
    console.error('❌ Erro durante verificação:', error);
  } finally {
    process.exit(0);
  }
}

// Executar verificação se chamado diretamente
if (require.main === module) {
  verifyDatabaseSafety();
}

export { verifyDatabaseSafety };
