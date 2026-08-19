import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { uploadToCloudinary } from '../lib/cloudinary';

interface VideoInfo {
  fileName: string;
  filePath: string;
  url: string;
  cloudinaryUrl?: string;
  publicId?: string;
}

async function migrateVideos() {
  try {
    console.log('🎬 Iniciando migração dos vídeos para o Cloudinary...');
    
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const files = await readdir(uploadsDir);
    
    // Filtrar apenas arquivos de vídeo
    const videoFiles = files.filter(file => 
      file.toLowerCase().match(/\.(mp4|avi|mov|wmv)$/)
    );
    
    console.log(`📹 Encontrados ${videoFiles.length} arquivos de vídeo para migrar`);
    
    const migrationResults: VideoInfo[] = [];
    
    for (const fileName of videoFiles) {
      try {
        console.log(`⏳ Migrando: ${fileName}`);
        
        const filePath = join(uploadsDir, fileName);
        const fileBuffer = await readFile(filePath);
        
        // Criar um objeto File-like para o Cloudinary
        const file = new File([fileBuffer], fileName, {
          type: 'video/mp4' // Assumindo MP4, mas o Cloudinary detectará automaticamente
        });
        
        // Fazer upload para o Cloudinary
        const result = await uploadToCloudinary(file, 'clientes-videos-migrated');
        
        migrationResults.push({
          fileName,
          filePath,
          url: `/uploads/${fileName}`,
          cloudinaryUrl: result.secure_url,
          publicId: result.public_id
        });
        
        console.log(`✅ Migrado com sucesso: ${fileName}`);
        console.log(`   URL: ${result.secure_url}`);
        
      } catch (error) {
        console.error(`❌ Erro ao migrar ${fileName}:`, error);
      }
    }
    
    // Salvar resultados da migração
    const migrationReport = {
      timestamp: new Date().toISOString(),
      totalFiles: videoFiles.length,
      successful: migrationResults.length,
      failed: videoFiles.length - migrationResults.length,
      results: migrationResults
    };
    
    const reportPath = join(process.cwd(), 'migration-report.json');
    await require('fs/promises').writeFile(
      reportPath, 
      JSON.stringify(migrationReport, null, 2)
    );
    
    console.log('\n📊 Relatório de migração:');
    console.log(`   Total de arquivos: ${migrationReport.totalFiles}`);
    console.log(`   Migrados com sucesso: ${migrationReport.successful}`);
    console.log(`   Falharam: ${migrationReport.failed}`);
    console.log(`   Relatório salvo em: ${reportPath}`);
    
    if (migrationResults.length > 0) {
      console.log('\n🔗 URLs dos vídeos migrados:');
      migrationResults.forEach(result => {
        console.log(`   ${result.fileName}: ${result.cloudinaryUrl}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  }
}

// Executar migração se chamado diretamente
if (require.main === module) {
  migrateVideos();
}

export { migrateVideos };
