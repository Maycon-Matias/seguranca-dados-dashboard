'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import FileUpload from '@/components/FileUpload';
import { User, Mail, Phone, MapPin, Calendar, FileText, Upload as UploadIcon } from 'lucide-react';

interface ClienteData {
  nome: string;
  cpf?: string;
  telefone?: string;
  endereco?: string;
  dataNascimento?: string;
  observacoes?: string;
}

export default function EditarCliente() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState('');
  const [clienteId, setClienteId] = useState('');
  
  const [formData, setFormData] = useState<ClienteData>({
    nome: '',
    cpf: '',
    telefone: '',
    endereco: '',
    dataNascimento: '',
    observacoes: ''
  });

  useEffect(() => {
    if (params.id) {
      fetchCliente(params.id as string);
    }
  }, [params.id]);

  const fetchCliente = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/clientes/${id}`);
      
      if (!response.ok) {
        throw new Error('Cliente não encontrado');
      }

      const cliente = await response.json();
      // Garantir que temos o ID do cliente (a API agora retorna id, mas mantemos fallback para segurança)
      setClienteId(cliente.id || cliente._id || (params.id as string));
      setFormData({
        nome: cliente.nome,
        cpf: cliente.cpf || '',
        telefone: cliente.telefone || '',
        endereco: cliente.endereco || '',
        dataNascimento: cliente.dataNascimento ? new Date(cliente.dataNascimento).toISOString().split('T')[0] : '',
        observacoes: cliente.observacoes || ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    } else if (numbers.length <= 9) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    } else {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({
      ...prev,
      telefone: formatted
    }));
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({
      ...prev,
      cpf: formatted
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setUploadError('');

    try {
      let anexosData = [];

      // Upload dos arquivos se selecionados
      if (selectedFiles.length > 0) {
        const uploadFormData = new FormData();
        selectedFiles.forEach(file => {
          uploadFormData.append('files', file);
        });

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const uploadErrorData = await uploadResponse.json();
          throw new Error(uploadErrorData.error || 'Erro no upload dos arquivos');
        }

        const uploadData = await uploadResponse.json();
        anexosData = uploadData.anexos;
      }

      // Atualizar cliente
      const clienteData = {
        ...formData,
        ...(formData.dataNascimento && { dataNascimento: new Date(formData.dataNascimento) }),
        ...(anexosData.length > 0 && { anexos: anexosData })
      };

      const response = await fetch(`/api/clientes/${clienteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar cliente');
      }

      router.push('/?success=Cliente atualizado com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !clienteId) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={() => router.push('/')} className="btn-primary">
              Voltar para Lista
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex items-center mb-6">
          <User className="w-8 h-8 text-primary-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Editar Cliente</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Dados Pessoais
            </h2>
            
            <div>
              <label className="label-field">
                <User className="w-4 h-4 inline mr-2" />
                Nome Completo *
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className="input-field"
                required
                placeholder="Digite o nome completo"
              />
            </div>

            <div>
              <label className="label-field">
                <FileText className="w-4 h-4 inline mr-2" />
                CPF
              </label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf || ''}
                onChange={handleCPFChange}
                className="input-field"
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>

            <div>
              <label className="label-field">
                <Phone className="w-4 h-4 inline mr-2" />
                Telefone
              </label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone || ''}
                onChange={handlePhoneChange}
                className="input-field"
                placeholder="(11) 99999-9999"
                maxLength={15}
              />
            </div>

            <div>
              <label className="label-field">
                <Calendar className="w-4 h-4 inline mr-2" />
                Data de Nascimento
              </label>
              <input
                type="date"
                name="dataNascimento"
                value={formData.dataNascimento || ''}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="label-field">
                <MapPin className="w-4 h-4 inline mr-2" />
                Endereço
              </label>
              <input
                type="text"
                name="endereco"
                value={formData.endereco || ''}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Rua, número, bairro, cidade"
              />
            </div>
          </div>

          {/* Arquivo */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              <UploadIcon className="w-5 h-5 inline mr-2" />
              Arquivo Anexo (opcional)
            </h2>
            <p className="text-sm text-gray-600">
              Selecione um novo arquivo para substituir o atual, ou deixe em branco para manter o arquivo existente.
            </p>
                    <FileUpload
          onFilesSelect={setSelectedFiles}
          selectedFiles={selectedFiles}
          error={uploadError}
          maxFiles={10}
        />
          </div>

          {/* Observações */}
          <div>
            <label className="label-field">
              <FileText className="w-4 h-4 inline mr-2" />
              Observações
            </label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleInputChange}
              className="input-field"
              rows={4}
              placeholder="Informações adicionais sobre o cliente..."
              maxLength={500}
            />
            <p className="text-sm text-gray-500 mt-1">
              {(formData.observacoes || '').length}/500 caracteres
            </p>
          </div>

          {/* Erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Botões */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="btn-secondary flex-1"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
