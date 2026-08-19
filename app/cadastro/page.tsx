'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function CadastroCliente() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState('');
  
  const [formData, setFormData] = useState<ClienteData>({
    nome: '',
    cpf: '',
    telefone: '',
    endereco: '',
    dataNascimento: '',
    observacoes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatPhone = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara (XX) XXXXX-XXXX
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const formatCPF = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara XXX.XXX.XXX-XX
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
    setLoading(true);
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

      // Criar cliente
      const clienteData = {
        ...formData,
        ...(formData.dataNascimento && { dataNascimento: new Date(formData.dataNascimento) }),
        anexos: anexosData
      };

      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar cliente');
      }

      router.push('/?success=Cliente cadastrado com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex items-center mb-6">
          <User className="w-8 h-8 text-primary-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Cadastro de Cliente</h1>
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
              Arquivo Anexo
            </h2>
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
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
