import { readFile } from 'fs/promises';
import { join } from 'path';

interface Anexo {
  nome: string;
  url: string;
  tipo: string;
  tamanho: number;
  mimeType: string;
  dataUpload: string;
  publicId?: string;
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

async function verifyMigration() {
  try {
    console.log('🔍 Verificando migração para o Cloudinary...');
    
    // Ler arquivo de clientes
    const clientesPath = join(process.cwd(), 'data', 'clientes.json');
    const clientesData = await readFile(clientesPath, 'utf-8');
    const clientes: Cliente[] = JSON.parse(clientesData);
    
    let totalAnexos = 0;
    let anexosCloudinary = 0;
    let anexosLocais = 0;
    let anexosVideos = 0;
    let anexosImagens = 0;
    let anexosDocumentos = 0;
    
    const clientesComAnexos = clientes.filter(c => c.anexos && c.anexos.length > 0);
    
    console.log(`📊 Estatísticas da migração:`);
    console.log(`   👥 Total de clientes: ${clientes.length}`);
    console.log(`   📎 Clientes com anexos: ${clientesComAnexos.length}`);
    
    // Analisar cada cliente
    for (const cliente of clientesComAnexos) {
      if (!cliente.anexos) continue;
      
      for (const anexo of cliente.anexos) {
        totalAnexos++;
        
        // Verificar se está no Cloudinary
        if (anexo.url.includes('cloudinary.com')) {
          anexosCloudinary++;
        } else if (anexo.url.startsWith('/uploads/')) {
          anexosLocais++;
        }
        
        // Contar por tipo
        if (anexo.tipo === 'video') {
          anexosVideos++;
        } else if (anexo.tipo === 'image') {
          anexosImagens++;
        } else {
          anexosDocumentos++;
        }
      }
    }
    
    console.log(`\n📎 Análise de anexos:`);
    console.log(`   📊 Total de anexos: ${totalAnexos}`);
    console.log(`   ☁️  Anexos no Cloudinary: ${anexosCloudinary}`);
    console.log(`   💻 Anexos locais: ${anexosLocais}`);
    console.log(`   🎬 Vídeos: ${anexosVideos}`);
    console.log(`   🖼️  Imagens: ${anexosImagens}`);
    console.log(`   📄 Documentos: ${anexosDocumentos}`);
    
    const percentualMigrado = totalAnexos > 0 ? (anexosCloudinary / totalAnexos * 100).toFixed(1) : '0';
    console.log(`\n📈 Percentual migrado: ${percentualMigrado}%`);
    
    if (anexosLocais > 0) {
      console.log(`\n⚠️  Ainda existem ${anexosLocais} anexos locais que não foram migrados.`);
      console.log('   Execute a migração novamente se necessário.');
    } else {
      console.log(`\n✅ Migração 100% completa! Todos os anexos estão no Cloudinary.`);
    }
    
    // Mostrar alguns exemplos de URLs
    console.log(`\n🔗 Exemplos de URLs migradas:`);
    let exemplosMostrados = 0;
    for (const cliente of clientesComAnexos) {
      if (!cliente.anexos) continue;
      
      for (const anexo of cliente.anexos) {
        if (anexo.url.includes('cloudinary.com') && exemplosMostrados < 3) {
          console.log(`   ${cliente.nome}: ${anexo.nome}`);
          console.log(`     ${anexo.url}`);
          exemplosMostrados++;
        }
      }
      if (exemplosMostrados >= 3) break;
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar migração:', error);
  }
}

// Executar verificação se chamado diretamente
if (require.main === module) {
  verifyMigration();
}

export { verifyMigration };
