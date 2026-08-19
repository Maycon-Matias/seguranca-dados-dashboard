import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { uploadToCloudinary } from '../lib/cloudinary';

interface Anexo {
  nome: string;
  url: string;
  tipo: string;
  tamanho: number;
  mimeType: string;
  dataUpload: string;
  publicId?: string; // Adicionar campo para Cloudinary
}

interface Cliente {
  id: string;
  nome: string;
  cpf?: string;
  telefone?: string;
  endereco?: string;
  dataNascimento?: string;
  anexos?: Anexo[];
  dataCadastro: string;
  observacoes?: string;
}

interface MigrationResult {
  cliente: Cliente;
  anexosMigrados: Anexo[];
  anexosComErro: string[];
}

async function migrateClientesVideos() {
  try {
    console.log('🎬 Iniciando migração completa de clientes e vídeos para o Cloudinary...');
    
    // Ler arquivo de clientes
    const clientesPath = join(process.cwd(), 'data', 'clientes.json');
    const clientesData = await readFile(clientesPath, 'utf-8');
    const clientes: Cliente[] = JSON.parse(clientesData);
    
    console.log(`👥 Encontrados ${clientes.length} clientes para processar`);
    
    const migrationResults: MigrationResult[] = [];
    let totalAnexos = 0;
    let anexosMigrados = 0;
    let anexosComErro = 0;
    
    // Processar cada cliente
    for (let i = 0; i < clientes.length; i++) {
      const cliente = clientes[i];
      console.log(`\n📋 Processando cliente ${i + 1}/${clientes.length}: ${cliente.nome}`);
      
      if (!cliente.anexos || cliente.anexos.length === 0) {
        console.log('   ⏭️  Nenhum anexo encontrado');
        migrationResults.push({
          cliente,
          anexosMigrados: [],
          anexosComErro: []
        });
        continue;
      }
      
      const anexosMigradosCliente: Anexo[] = [];
      const anexosComErroCliente: string[] = [];
      
      // Processar cada anexo do cliente
      for (const anexo of cliente.anexos) {
        totalAnexos++;
        console.log(`   📎 Processando anexo: ${anexo.nome}`);
        
        // Verificar se é um arquivo local (começa com /uploads/)
        if (!anexo.url.startsWith('/uploads/')) {
          console.log('   ⏭️  Anexo já está na nuvem ou não é local');
          anexosMigradosCliente.push(anexo);
          anexosMigrados++;
          continue;
        }
        
        try {
          // Extrair nome do arquivo da URL
          const fileName = anexo.url.replace('/uploads/', '');
          const filePath = join(process.cwd(), 'public', 'uploads', fileName);
          
          // Ler arquivo
          const fileBuffer = await readFile(filePath);
          
          // Criar objeto File-like para o Cloudinary
          const file = new File([fileBuffer], anexo.nome, {
            type: anexo.mimeType
          });
          
          // Fazer upload para o Cloudinary
          const result = await uploadToCloudinary(file, 'clientes-videos-migrated');
          
          // Atualizar anexo com nova URL
          const anexoMigrado: Anexo = {
            ...anexo,
            url: result.secure_url,
            publicId: result.public_id
          };
          
          anexosMigradosCliente.push(anexoMigrado);
          anexosMigrados++;
          
          console.log(`   ✅ Migrado: ${anexo.nome}`);
          console.log(`      URL: ${result.secure_url}`);
          
        } catch (error) {
          console.error(`   ❌ Erro ao migrar ${anexo.nome}:`, error);
          anexosComErroCliente.push(anexo.nome);
          anexosComErro++;
          
          // Manter anexo original em caso de erro
          anexosMigradosCliente.push(anexo);
        }
      }
      
      // Atualizar cliente com anexos migrados
      const clienteAtualizado: Cliente = {
        ...cliente,
        anexos: anexosMigradosCliente
      };
      
      migrationResults.push({
        cliente: clienteAtualizado,
        anexosMigrados: anexosMigradosCliente.filter(a => a.publicId),
        anexosComErro: anexosComErroCliente
      });
    }
    
    // Criar backup do arquivo original
    const backupPath = join(process.cwd(), 'data', `clientes-backup-${Date.now()}.json`);
    await writeFile(backupPath, clientesData);
    console.log(`\n💾 Backup criado: ${backupPath}`);
    
    // Atualizar arquivo de clientes com URLs migradas
    const clientesAtualizados = migrationResults.map(r => r.cliente);
    const clientesAtualizadosPath = join(process.cwd(), 'data', 'clientes.json');
    await writeFile(clientesAtualizadosPath, JSON.stringify(clientesAtualizados, null, 2));
    
    // Gerar relatório detalhado
    const migrationReport = {
      timestamp: new Date().toISOString(),
      totalClientes: clientes.length,
      totalAnexos,
      anexosMigrados,
      anexosComErro,
      clientesComAnexos: clientes.filter(c => c.anexos && c.anexos.length > 0).length,
      results: migrationResults.map(r => ({
        clienteNome: r.cliente.nome,
        clienteId: r.cliente.id,
        totalAnexos: r.cliente.anexos?.length || 0,
        anexosMigrados: r.anexosMigrados.length,
        anexosComErro: r.anexosComErro.length,
        anexosComErroList: r.anexosComErro
      }))
    };
    
    const reportPath = join(process.cwd(), 'migration-clientes-report.json');
    await writeFile(reportPath, JSON.stringify(migrationReport, null, 2));
    
    // Exibir resumo
    console.log('\n📊 RESUMO DA MIGRAÇÃO:');
    console.log(`   👥 Total de clientes: ${migrationReport.totalClientes}`);
    console.log(`   📎 Total de anexos: ${migrationReport.totalAnexos}`);
    console.log(`   ✅ Anexos migrados: ${migrationReport.anexosMigrados}`);
    console.log(`   ❌ Anexos com erro: ${migrationReport.anexosComErro}`);
    console.log(`   📁 Clientes com anexos: ${migrationReport.clientesComAnexos}`);
    console.log(`   📄 Relatório salvo em: ${reportPath}`);
    console.log(`   💾 Backup salvo em: ${backupPath}`);
    
    if (anexosComErro > 0) {
      console.log('\n⚠️  ANEXOS COM ERRO:');
      migrationResults.forEach(result => {
        if (result.anexosComErro.length > 0) {
          console.log(`   ${result.cliente.nome}:`);
          result.anexosComErro.forEach(anexo => {
            console.log(`     - ${anexo}`);
          });
        }
      });
    }
    
    console.log('\n🎉 Migração concluída!');
    console.log('   Agora todos os vídeos estão acessíveis de qualquer lugar!');
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  }
}

// Executar migração se chamado diretamente
if (require.main === module) {
  migrateClientesVideos();
}

export { migrateClientesVideos };
