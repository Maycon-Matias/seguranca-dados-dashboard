import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { join } from 'path';
import connectDB from '../lib/mongodb';
import { Cliente } from '../models/Cliente';

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });

interface AnexoJSON {
  nome: string;
  url: string;
  tipo: string;
  tamanho: number;
  mimeType: string;
  dataUpload: string;
}

interface ClienteJSON {
  id: string;
  nome: string;
  cpf?: string;
  telefone?: string;
  endereco?: string;
  dataNascimento?: string;
  observacoes?: string;
  anexos?: AnexoJSON[];
  dataCadastro: string;
}

async function migrateToMongoDB() {
  try {
    console.log('🗄️ Iniciando migração para MongoDB Atlas - PoraCred...');
    console.log('🗄️ Banco: Segurança-clientes');
    console.log('🔒 Trabalhando com coleção específica: sistema_clientes');
    console.log('⚠️  Nenhum dado do CRM será alterado');
    
    // Conectar ao banco
    await connectDB();
    
    // Ler arquivo JSON
    const clientesPath = join(process.cwd(), 'data', 'clientes.json');
    const clientesData = await readFile(clientesPath, 'utf-8');
    const clientesJSON: ClienteJSON[] = JSON.parse(clientesData);
    
    console.log(`📊 Encontrados ${clientesJSON.length} clientes para migrar`);
    
    // Verificar se já existem dados na coleção sistema_clientes
    const existingCount = await Cliente.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  A coleção 'sistema_clientes' já possui ${existingCount} registros`);
      console.log('🤔 Deseja continuar e adicionar novos registros? (Ctrl+C para cancelar)');
      
      // Aguardar 5 segundos para o usuário cancelar se necessário
      await new Promise(resolve => setTimeout(resolve, 5000));
      console.log('✅ Continuando migração...');
    } else {
      console.log('✅ Coleção vazia, migração segura');
    }
    
    let migratedCount = 0;
    let errorCount = 0;
    
    // Migrar cada cliente
    for (let i = 0; i < clientesJSON.length; i++) {
      const clienteJSON = clientesJSON[i];
      
      try {
        console.log(`📋 Migrando cliente ${i + 1}/${clientesJSON.length}: ${clienteJSON.nome}`);
        
        // Converter dados para formato MongoDB
        const clienteData = {
          nome: clienteJSON.nome,
          cpf: clienteJSON.cpf,
          telefone: clienteJSON.telefone,
          endereco: clienteJSON.endereco,
          observacoes: clienteJSON.observacoes,
          anexos: clienteJSON.anexos?.map(anexo => ({
            nome: anexo.nome,
            url: anexo.url,
            tipo: anexo.tipo as 'video' | 'image' | 'document',
            tamanho: anexo.tamanho,
            mimeType: anexo.mimeType,
            dataUpload: new Date(anexo.dataUpload)
          })) || [],
          dataNascimento: clienteJSON.dataNascimento ? new Date(clienteJSON.dataNascimento) : undefined,
          dataCadastro: new Date(clienteJSON.dataCadastro)
        };
        
        // Criar cliente no MongoDB
        const cliente = new Cliente(clienteData);
        await cliente.save();
        
        migratedCount++;
        console.log(`   ✅ Migrado com sucesso`);
        
      } catch (error) {
        errorCount++;
        console.error(`   ❌ Erro ao migrar ${clienteJSON.nome}:`, error);
      }
    }
    
    // Estatísticas finais
    const totalInDB = await Cliente.countDocuments();
    const totalAnexos = await Cliente.aggregate([
      { $unwind: '$anexos' },
      { $count: 'total' }
    ]);
    
    console.log('\n📊 RESUMO DA MIGRAÇÃO:');
    console.log(`   📁 Total no JSON: ${clientesJSON.length}`);
    console.log(`   ✅ Migrados com sucesso: ${migratedCount}`);
    console.log(`   ❌ Erros: ${errorCount}`);
    console.log(`   🗄️ Total no MongoDB: ${totalInDB}`);
    console.log(`   📎 Total de anexos: ${totalAnexos[0]?.total || 0}`);
    
    // Criar backup do JSON original
    const backupPath = join(process.cwd(), 'data', `clientes-backup-mongodb-${Date.now()}.json`);
    await require('fs/promises').writeFile(backupPath, clientesData);
    console.log(`   💾 Backup criado: ${backupPath}`);
    
    console.log('\n🎉 Migração para MongoDB concluída!');
    console.log('   Agora você tem um banco de dados robusto e escalável!');
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  } finally {
    process.exit(0);
  }
}

// Executar migração se chamado diretamente
if (require.main === module) {
  migrateToMongoDB();
}

export { migrateToMongoDB };
