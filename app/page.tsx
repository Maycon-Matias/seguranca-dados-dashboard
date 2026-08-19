'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Plus, Users, FileText } from 'lucide-react';
import ClienteCard from '@/components/ClienteCard';

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

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Verificar se há mensagem de sucesso na URL
    const success = searchParams.get('success');
    if (success) {
      setSuccessMessage(success);
      // Remover a mensagem após 5 segundos
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchClientes();
  }, [pagination.page, search]);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search })
      });

      const response = await fetch(`/api/clientes?${params}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar clientes');
      }

      const data = await response.json();
      setClientes(data.clientes);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleEdit = (cliente: Cliente) => {
    router.push(`/editar/${cliente.id}`);
  };

  const handleDelete = (clienteId: string) => {
    setClientes(prev => prev.filter(c => c.id !== clienteId));
    setPagination(prev => ({ ...prev, total: prev.total - 1 }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Users className="w-8 h-8 text-primary-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
        </div>
        <button
          onClick={() => router.push('/cadastro')}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </button>
      </div>

      {/* Mensagem de sucesso */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total de Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Com Arquivos</p>
              <p className="text-2xl font-bold text-gray-900">
                {clientes.filter(c => c.anexos && c.anexos.length > 0).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Página Atual</p>
              <p className="text-2xl font-bold text-gray-900">
                {pagination.page} de {pagination.pages}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Busca */}
      <div className="card mb-6">
        <form onSubmit={handleSearch} className="flex space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
                placeholder="Buscar por nome, CPF ou telefone..."
              />
            </div>
          </div>
          <button type="submit" className="btn-primary">
            Buscar
          </button>
        </form>
      </div>

      {/* Lista de Clientes */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="card">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={fetchClientes} className="btn-primary">
              Tentar Novamente
            </button>
          </div>
        </div>
      ) : clientes.length === 0 ? (
        <div className="card">
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum cliente encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              {search ? 'Tente ajustar os termos de busca.' : 'Comece cadastrando seu primeiro cliente.'}
            </p>
            <button
              onClick={() => router.push('/cadastro')}
              className="btn-primary"
            >
              Cadastrar Cliente
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {clientes.map((cliente) => (
              <ClienteCard
                key={cliente.id}
                cliente={cliente}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Paginação */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg ${
                    page === pagination.page
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
