import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      );
    }
    
    // Validar número máximo de arquivos
    if (files.length > 10) {
      return NextResponse.json(
        { error: 'Máximo de 10 arquivos permitidos por vez' },
        { status: 400 }
      );
    }
    
    // Validar tipos de arquivo
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'video/mp4',
      'video/avi',
      'video/mov',
      'video/wmv'
    ];
    
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      return NextResponse.json(
        { error: `Tipos de arquivo não permitidos: ${invalidFiles.map(f => f.name).join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validar tamanho dos arquivos (50MB máximo por arquivo)
    const maxSize = 50 * 1024 * 1024; // 50MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      return NextResponse.json(
        { error: `Arquivos muito grandes: ${oversizedFiles.map(f => f.name).join(', ')}. Tamanho máximo: 50MB` },
        { status: 400 }
      );
    }
    
    const uploadResults = [];
    
    for (const file of files) {
      try {
        // Fazer upload para o Cloudinary
        const cloudinaryResult = await uploadToCloudinary(file, 'clientes-videos');
        
        // Determinar tipo de arquivo
        let arquivoTipo = 'document';
        if (file.type.startsWith('image/')) {
          arquivoTipo = 'image';
        } else if (file.type.startsWith('video/')) {
          arquivoTipo = 'video';
        }
        
        uploadResults.push({
          nome: file.name,
          url: cloudinaryResult.secure_url,
          publicId: cloudinaryResult.public_id,
          tipo: arquivoTipo,
          tamanho: file.size,
          mimeType: file.type,
          dataUpload: new Date()
        });
      } catch (error) {
        console.error(`Erro no upload do arquivo ${file.name}:`, error);
        
        // Fallback: salvar localmente se o Cloudinary falhar
        try {
          const uploadsDir = join(process.cwd(), 'public', 'uploads');
          if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true });
          }
          
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          
          const timestamp = Date.now();
          const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const filePath = join(uploadsDir, fileName);
          
          await writeFile(filePath, buffer);
          
          let arquivoTipo = 'document';
          if (file.type.startsWith('image/')) {
            arquivoTipo = 'image';
          } else if (file.type.startsWith('video/')) {
            arquivoTipo = 'video';
          }
          
          uploadResults.push({
            nome: file.name,
            url: `/uploads/${fileName}`,
            publicId: null,
            tipo: arquivoTipo,
            tamanho: file.size,
            mimeType: file.type,
            dataUpload: new Date()
          });
        } catch (fallbackError) {
          console.error(`Erro no fallback do arquivo ${file.name}:`, fallbackError);
          return NextResponse.json(
            { error: `Erro no upload do arquivo ${file.name}` },
            { status: 500 }
          );
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      anexos: uploadResults
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
