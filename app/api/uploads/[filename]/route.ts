import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { createReadStream } from 'fs';
import { join } from 'path';
import { existsSync } from 'fs';
import { findFile } from '@/lib/file-paths';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename: filenameRaw } = await params;
    
    console.log(`📥 Parâmetro recebido (raw): ${filenameRaw}`);
    
    // Decodificar o nome do arquivo (pode vir codificado na URL)
    let filename: string;
    try {
      filename = decodeURIComponent(filenameRaw);
      console.log(`📝 Nome decodificado: ${filename}`);
    } catch (decodeError) {
      // Se falhar na decodificação, usar o nome original
      console.warn(`⚠️ Erro ao decodificar, usando nome original: ${decodeError}`);
      filename = filenameRaw;
    }
    
    console.log(`🔍 Buscando arquivo: ${filename}`);
    
    // Validar nome do arquivo (prevenir path traversal)
    // Permitir espaços e caracteres normais, mas bloquear path traversal
    if (!filename || 
        filename.includes('..') || 
        filename.startsWith('/') || 
        filename.startsWith('\\') ||
        filename.includes('\\')) {
      console.error(`❌ Nome de arquivo inválido (segurança): ${filename}`);
      return NextResponse.json(
        { error: 'Nome de arquivo inválido' },
        { status: 400 }
      );
    }

    // Buscar arquivo em todos os locais possíveis (incluindo busca case-insensitive)
    const { path: filePath, searchedPaths: possiveisCaminhos } = findFile(filename);

    // Se não encontrou em nenhum lugar, retornar erro com detalhes
    if (!filePath) {
      console.error(`❌ Arquivo não encontrado: ${filename}`);
      console.error(`📁 Locais verificados:`);
      possiveisCaminhos.forEach((caminho, index) => {
        const existe = existsSync(caminho);
        console.error(`   ${index + 1}. ${caminho} ${existe ? '✅' : '❌'}`);
      });
      
      // Tentar listar o que existe na pasta alternativa
      const pastaAlternativa = join('C:', 'Dados Segurança');
      if (existsSync(pastaAlternativa)) {
        try {
          const fs = require('fs');
          const arquivos = fs.readdirSync(pastaAlternativa);
          console.error(`📋 Arquivos encontrados em ${pastaAlternativa}:`);
          arquivos.slice(0, 10).forEach((arquivo: string) => {
            console.error(`   - ${arquivo}`);
          });
          if (arquivos.length > 10) {
            console.error(`   ... e mais ${arquivos.length - 10} arquivos`);
          }
        } catch (err) {
          console.error(`   Erro ao listar arquivos: ${err}`);
        }
      }
      
      return NextResponse.json(
        { 
          error: 'Arquivo não encontrado',
          filename: filename,
          searchedPaths: possiveisCaminhos
        },
        { status: 404 }
      );
    }
    
    console.log(`✅ Arquivo encontrado: ${filePath}`);

    // Obter informações do arquivo
    const fileStats = await stat(filePath);
    const fileSize = fileStats.size;
    
    // Determinar tipo MIME baseado na extensão
    const ext = filename.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';
    
    const mimeTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'mp4': 'video/mp4',
      'avi': 'video/x-msvideo',
      'mov': 'video/quicktime',
      'wmv': 'video/x-ms-wmv',
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
    
    if (ext && mimeTypes[ext]) {
      contentType = mimeTypes[ext];
    }

    // Headers base
    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${encodeURIComponent(filename)}"`,
      'Accept-Ranges': 'bytes',
      'Content-Length': fileSize.toString(),
    };
    
    // Para vídeos, adicionar headers específicos
    if (contentType.startsWith('video/')) {
      // Headers importantes para streaming de vídeo
      headers['Cache-Control'] = 'public, max-age=3600'; // Cache por 1 hora
      headers['X-Content-Type-Options'] = 'nosniff';
      // Garantir que o Content-Type está correto e específico
      if (contentType === 'video/mp4') {
        headers['Content-Type'] = 'video/mp4'; // Tipo específico para MP4
      }
    } else {
      // Para outros arquivos, cache mais longo
      headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    }
    
    // Verificar se há Range request (para streaming de vídeo)
    const range = request.headers.get('range');
    if (range && contentType.startsWith('video/')) {
      console.log(`📹 Range request recebido: ${range}`);
      
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      
      // Validar range
      if (start >= fileSize || end >= fileSize || start > end) {
        headers['Content-Range'] = `bytes */${fileSize}`;
        return new NextResponse(null, {
          status: 416, // Range Not Satisfiable
          headers,
        });
      }
      
      const chunksize = (end - start) + 1;
      
      console.log(`📦 Servindo chunk: bytes ${start}-${end}/${fileSize} (${chunksize} bytes)`);
      
      // Criar stream para ler apenas a parte solicitada
      // IMPORTANTE: Next.js precisa de um stream compatível
      const stream = createReadStream(filePath, { start, end });
      
      // Converter para ReadableStream para compatibilidade com Next.js
      const readableStream = new ReadableStream({
        start(controller) {
          stream.on('data', (chunk) => {
            if (chunk instanceof Uint8Array) {
              controller.enqueue(chunk);
            } else if (Buffer.isBuffer(chunk)) {
              controller.enqueue(new Uint8Array(chunk));
            } else if (typeof chunk === 'string') {
              controller.enqueue(new TextEncoder().encode(chunk));
            } else {
              console.warn('Chunk de tipo inesperado recebido no stream de vídeo (range).');
            }
          });
          stream.on('end', () => {
            controller.close();
          });
          stream.on('error', (err) => {
            controller.error(err);
          });
        },
        cancel() {
          stream.destroy();
        }
      });
      
      headers['Content-Range'] = `bytes ${start}-${end}/${fileSize}`;
      headers['Content-Length'] = chunksize.toString();
      headers['Accept-Ranges'] = 'bytes';
      
      return new NextResponse(readableStream, {
        status: 206, // Partial Content
        headers,
      });
    }
    
    // Para vídeos SEM range request, o navegador pode fazer range requests depois
    // Sempre usar streaming para vídeos, mesmo pequenos, para suportar range requests
    if (contentType.startsWith('video/')) {
      console.log(`📹 Vídeo sem range request inicial (${(fileSize / 1024 / 1024).toFixed(2)} MB)`);
      console.log(`📹 Headers:`, JSON.stringify(headers, null, 2));
      
      // IMPORTANTE: Para vídeos, sempre usar streaming para suportar range requests
      // Mesmo que não venha range request inicial, o navegador pode fazer depois
      const stream = createReadStream(filePath);
      const readableStream = new ReadableStream({
        start(controller) {
          stream.on('data', (chunk) => {
            if (chunk instanceof Uint8Array) {
              controller.enqueue(chunk);
            } else if (Buffer.isBuffer(chunk)) {
              controller.enqueue(new Uint8Array(chunk));
            } else if (typeof chunk === 'string') {
              controller.enqueue(new TextEncoder().encode(chunk));
            } else {
              console.warn('Chunk de tipo inesperado recebido no stream de vídeo.');
            }
          });
          stream.on('end', () => {
            controller.close();
          });
          stream.on('error', (err) => {
            console.error('❌ Erro no stream do vídeo:', err);
            controller.error(err);
          });
        },
        cancel() {
          stream.destroy();
        }
      });
      
      return new NextResponse(readableStream, {
        headers,
      });
      
      /* Código antigo - removido porque não suporta range requests subsequentes
      if (fileSize < 100 * 1024 * 1024) { // Menor que 100MB
        console.log(`📹 Vídeo pequeno (${(fileSize / 1024 / 1024).toFixed(2)} MB), servindo arquivo completo`);
        const fileBuffer = await readFile(filePath);
        return new NextResponse(fileBuffer, {
          headers,
        });
      } else {
        console.log(`📹 Vídeo grande (${(fileSize / 1024 / 1024).toFixed(2)} MB), usando stream`);
        // Criar ReadableStream para compatibilidade com Next.js
        const stream = createReadStream(filePath);
        const readableStream = new ReadableStream({
          start(controller) {
            stream.on('data', (chunk) => {
              controller.enqueue(new Uint8Array(chunk));
            });
            stream.on('end', () => {
              controller.close();
            });
            stream.on('error', (err) => {
              console.error('Erro no stream:', err);
              controller.error(err);
            });
          },
          cancel() {
            stream.destroy();
          }
        });
        
        return new NextResponse(readableStream, {
          headers,
        });
      }
      */
    }
    
    // Para arquivos pequenos (imagens, documentos), ler tudo na memória
    if (fileSize < 50 * 1024 * 1024) { // Menor que 50MB
      const fileBuffer = await readFile(filePath);
      const arrayBuffer = fileBuffer.buffer.slice(
        fileBuffer.byteOffset,
        fileBuffer.byteOffset + fileBuffer.byteLength
      ) as ArrayBuffer;
      return new NextResponse(arrayBuffer, {
        headers,
      });
    } else {
      // Para arquivos grandes, usar stream mesmo sem range
      console.log(`📦 Arquivo grande (${fileSize} bytes), usando stream`);
      const stream = createReadStream(filePath);
      const readableStream = new ReadableStream({
        start(controller) {
          stream.on('data', (chunk) => {
            if (chunk instanceof Uint8Array) {
              controller.enqueue(chunk);
            } else if (Buffer.isBuffer(chunk)) {
              controller.enqueue(new Uint8Array(chunk));
            } else if (typeof chunk === 'string') {
              controller.enqueue(new TextEncoder().encode(chunk));
            } else {
              console.warn('Chunk de tipo inesperado recebido no stream de arquivo grande.');
            }
          });
          stream.on('end', () => {
            controller.close();
          });
          stream.on('error', (err) => {
            controller.error(err);
          });
        },
        cancel() {
          stream.destroy();
        }
      });
      return new NextResponse(readableStream, {
        headers,
      });
    }
  } catch (error) {
    console.error('Erro ao servir arquivo:', error);
    return NextResponse.json(
      { error: 'Erro ao servir arquivo' },
      { status: 500 }
    );
  }
}

