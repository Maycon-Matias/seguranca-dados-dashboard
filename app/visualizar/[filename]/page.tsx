'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, X } from 'lucide-react';

export default function VisualizarArquivo() {
  const params = useParams();
  const router = useRouter();
  
  // Decodificar o nome do arquivo (pode vir codificado na URL)
  let filename: string;
  try {
    filename = decodeURIComponent(params.filename as string);
    console.log('📝 Nome do arquivo decodificado:', filename);
  } catch (error) {
    // Se falhar na decodificação, usar o nome original
    filename = params.filename as string;
    console.warn('⚠️ Erro ao decodificar, usando nome original:', error);
  }
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fileType, setFileType] = useState<'image' | 'video' | 'document' | 'unknown'>('unknown');
  const [fileUrl, setFileUrl] = useState('');

  useEffect(() => {
    if (filename) {
      // Determinar tipo de arquivo
      const ext = filename.split('.').pop()?.toLowerCase();
      if (ext) {
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
          setFileType('image');
        } else if (['mp4', 'avi', 'mov', 'wmv'].includes(ext)) {
          setFileType('video');
        } else {
          setFileType('document');
        }
      }
      
      // Construir URL (codificar o nome do arquivo corretamente)
      // encodeURIComponent preserva caracteres válidos mas codifica especiais
      const url = `/api/uploads/${encodeURIComponent(filename)}`;
      setFileUrl(url);
      
      console.log('🔍 Verificando arquivo:', filename);
      console.log('🔗 URL:', url);
      
      // Verificar se o arquivo existe fazendo uma requisição HEAD
      fetch(url, { method: 'HEAD' })
        .then(response => {
          console.log('📊 Resposta HEAD:', response.status, response.statusText);
          if (!response.ok) {
            // Se HEAD falhar, tentar GET para ver o erro completo
            return fetch(url, { method: 'GET' })
              .then(getResponse => {
                if (!getResponse.ok) {
                  return getResponse.json().then(errData => {
                    throw new Error(`HTTP ${getResponse.status}: ${JSON.stringify(errData)}`);
                  }).catch(() => {
                    throw new Error(`HTTP ${getResponse.status}: ${getResponse.statusText}`);
                  });
                }
                return getResponse;
              });
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('❌ Erro ao verificar arquivo:', err);
          setError(`Erro ao carregar arquivo: ${err.message}`);
          setLoading(false);
        });
    }
  }, [filename]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="btn-primary"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold truncate max-w-md">{filename}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        {fileType === 'image' && (
          <div className="max-w-7xl w-full">
            <img
              src={fileUrl}
              alt={filename}
              className="max-w-full max-h-[calc(100vh-120px)] mx-auto rounded-lg shadow-2xl object-contain"
              onError={(e) => {
                console.error('❌ Erro ao carregar imagem:', fileUrl);
                console.error('Erro detalhado:', e);
                setError(`Erro ao carregar imagem. URL: ${fileUrl}`);
                setLoading(false);
              }}
              onLoad={() => {
                console.log('✅ Imagem carregada com sucesso:', fileUrl);
                setLoading(false);
              }}
            />
          </div>
        )}

        {fileType === 'video' && (
          <div className="max-w-7xl w-full">
            <video
              src={fileUrl}
              controls
              autoPlay
              preload="metadata"
              className="max-w-full max-h-[calc(100vh-120px)] mx-auto rounded-lg shadow-2xl"
              onError={(e) => {
                console.error('❌ Erro ao carregar vídeo:', fileUrl);
                console.error('Erro detalhado:', e);
                const video = e.currentTarget;
                console.error('Video error code:', video.error?.code);
                console.error('Video error message:', video.error?.message);
                setError(`Erro ao carregar vídeo. URL: ${fileUrl}`);
                setLoading(false);
              }}
              onLoadedMetadata={() => {
                console.log('✅ Vídeo carregado com sucesso:', fileUrl);
                setLoading(false);
              }}
            >
              Seu navegador não suporta a tag de vídeo.
              <a href={fileUrl} download>Clique aqui para baixar o vídeo</a>
            </video>
          </div>
        )}

        {fileType === 'document' && (
          <div className="max-w-4xl w-full bg-white rounded-lg shadow-2xl p-8">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Documento: {filename}</p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Abrir Documento
              </a>
            </div>
          </div>
        )}

        {fileType === 'unknown' && (
          <div className="max-w-4xl w-full bg-white rounded-lg shadow-2xl p-8">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Arquivo: {filename}</p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Abrir Arquivo
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

