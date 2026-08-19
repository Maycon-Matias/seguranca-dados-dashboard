import mongoose from 'mongoose';

// Carregar variáveis de ambiente se não estiverem disponíveis
if (!process.env.MONGODB_URI) {
  try {
    require('dotenv').config({ path: '.env.local' });
  } catch (error) {
    // Ignorar erro se dotenv não estiver disponível
  }
}

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Por favor, defina a variável MONGODB_URI no arquivo .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Conectado ao MongoDB Atlas - PoraCred');
      console.log('🗄️ Banco: Segurança-clientes');
      console.log('🔒 Trabalhando apenas com nova coleção: sistema_clientes');
      console.log('⚠️  Nenhum dado do CRM será alterado');
      return mongoose;
    }).catch((error) => {
      console.error('❌ Erro ao conectar com MongoDB:', error);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
