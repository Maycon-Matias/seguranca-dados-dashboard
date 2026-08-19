'use client';

import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  Eye, 
  Edit, 
  Trash2,
  ExternalLink,
  Image,
  Video,
  File
} from 'lucide-react';

interface Anexo {
  nome: string;
  url: string;
  tipo: string;
  tamanho: number;
  mimeType: string;
  dataUpload: string;
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

interface ClienteCardProps {
  cliente: Cliente;
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: string) => void;
}

export default function ClienteCard({ cliente, onEdit, onDelete }: ClienteCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (tipo: string) => {
    switch (tipo) {
      case 'image':
        return <Image className="w-4 h-4 text-blue-500" />;
      case 'video':
        return <Video className="w-4 h-4 text-purple-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/clientes/${cliente.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar cliente');
      }

      onDelete(cliente.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      alert('Erro ao deletar cliente');
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
            <User className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{cliente.nome}</h3>
            <p className="text-sm text-gray-500">
              Cadastrado em {formatDate(cliente.dataCadastro)}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Ver detalhes"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(cliente)}
            className="p-2 text-blue-400 hover:text-blue-600 transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-red-400 hover:text-red-600 transition-colors"
            title="Deletar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {cliente.cpf && (
          <div className="flex items-center text-sm text-gray-600">
            <FileText className="w-4 h-4 mr-2" />
            {cliente.cpf}
          </div>
        )}
        {cliente.telefone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            {cliente.telefone}
          </div>
        )}
        {cliente.anexos && cliente.anexos.length > 0 && (
          <div className="text-sm text-gray-600">
            <div className="flex items-center mb-1">
              <File className="w-4 h-4 mr-2" />
              <span className="font-medium">{cliente.anexos.length} anexo(s)</span>
            </div>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {cliente.anexos.slice(0, 3).map((anexo, index) => (
                <div key={index} className="flex items-center text-xs">
                  {getFileIcon(anexo.tipo)}
                  <span className="ml-2 mr-2 truncate">{anexo.nome}</span>
                  <a
                    href={(() => {
                      if (anexo.url.startsWith('http')) {
                        return anexo.url;
                      }
                      // Para arquivos locais, extrair o nome da URL (tem timestamp)
                      // A URL tem formato: /uploads/1757427769981-Nildoir.mp4
                      const urlParts = anexo.url.split('/');
                      let fileName = urlParts[urlParts.length - 1];
                      
                      // REMOVER TIMESTAMP do nome do arquivo antes de usar na URL
                      // Isso evita problemas com o Next.js processando números grandes
                      // Formato: 1234567890-nome.mp4 → nome.mp4
                      fileName = fileName.replace(/^\d+-/, '');
                      
                      // Codificar o nome do arquivo para URL (trata caracteres especiais)
                      const encodedFileName = encodeURIComponent(fileName);
                      console.log('🔗 Link para arquivo (sem timestamp):', fileName, '→', `/visualizar/${encodedFileName}`);
                      return `/visualizar/${encodedFileName}`;
                    })()}
                    target={anexo.url.startsWith('http') ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-800 transition-colors"
                    title="Abrir arquivo"
                    onClick={(e) => {
                      // Log para debug
                      const href = e.currentTarget.getAttribute('href');
                      console.log('🖱️ Clicou no arquivo:', href);
                    }}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
              {cliente.anexos.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{cliente.anexos.length - 3} mais...
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
          {cliente.endereco && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              {cliente.endereco}
            </div>
          )}
          {cliente.dataNascimento && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              Nascido em {formatDate(cliente.dataNascimento)}
            </div>
          )}
          {cliente.anexos && cliente.anexos.length > 0 && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Anexos:</span>
              <div className="mt-1 space-y-1">
                {cliente.anexos.map((anexo, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getFileIcon(anexo.tipo)}
                      <span className="ml-2">{anexo.nome}</span>
                      <span className="ml-2 text-gray-500">
                        ({formatFileSize(anexo.tamanho)})
                      </span>
                    </div>
                    <a
                      href={(() => {
                        if (anexo.url.startsWith('http')) {
                          return anexo.url;
                        }
                        // Para arquivos locais, extrair o nome da URL (tem timestamp)
                        // A URL tem formato: /uploads/1757427769981-Nildoir.mp4
                        const urlParts = anexo.url.split('/');
                        let fileName = urlParts[urlParts.length - 1];
                        
                        // REMOVER TIMESTAMP do nome do arquivo antes de usar na URL
                        // Isso evita problemas com o Next.js processando números grandes
                        // Formato: 1234567890-nome.mp4 → nome.mp4
                        fileName = fileName.replace(/^\d+-/, '');
                        
                        // Codificar o nome do arquivo para URL (trata caracteres especiais)
                        const encodedFileName = encodeURIComponent(fileName);
                        console.log('🔗 Link para arquivo (sem timestamp):', fileName, '→', `/visualizar/${encodedFileName}`);
                        return `/visualizar/${encodedFileName}`;
                      })()}
                      target={anexo.url.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-800 transition-colors ml-2"
                      title="Abrir arquivo"
                      onClick={(e) => {
                        // Log para debug
                        const href = e.currentTarget.getAttribute('href');
                        console.log('🖱️ Clicou no arquivo:', href);
                      }}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          {cliente.observacoes && (
            <div className="flex items-start text-sm text-gray-600">
              <FileText className="w-4 h-4 mr-2 mt-0.5" />
              <span>{cliente.observacoes}</span>
            </div>
          )}
        </div>
      )}

      {showDeleteConfirm && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 mb-3">
            Tem certeza que deseja deletar este cliente? Esta ação não pode ser desfeita.
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="btn-secondary text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              className="btn-danger text-sm"
            >
              Deletar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
