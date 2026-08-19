# Sistema de Clientes com Next.js

Um sistema completo de gerenciamento de clientes que permite cadastrar, editar, listar e deletar clientes, com funcionalidade de upload de arquivos (fotos, documentos e vídeos) armazenados localmente.

## 🚀 Funcionalidades

- ✅ **CRUD Completo de Clientes**
  - Cadastro de clientes com dados pessoais
  - Edição de informações
  - Listagem com paginação e busca
  - Exclusão de clientes

- ✅ **Upload de Arquivos**
  - Suporte a imagens (JPG, PNG, GIF, WebP)
  - Suporte a documentos (PDF, DOC, DOCX)
  - Suporte a vídeos (MP4, AVI, MOV, WMV)
  - Preview de imagens
  - Armazenamento local

- ✅ **Interface Moderna**
  - Design responsivo com Tailwind CSS
  - Componentes reutilizáveis
  - Validação de formulários
  - Feedback visual para ações

- ✅ **Funcionalidades Avançadas**
  - Busca por nome, CPF ou telefone
  - Paginação de resultados
  - Validação de dados
  - Tratamento de erros

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Armazenamento**: Arquivos JSON locais
- **Upload**: Sistema de arquivos local
- **Ícones**: Lucide React

## 📋 Pré-requisitos

- Node.js 18+ 

## ⚙️ Configuração

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd sistema-clientes
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Execute o projeto

```bash
npm run dev
```

O sistema estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
sistema-clientes/
├── app/
│   ├── api/
│   │   ├── clientes/
│   │   │   ├── route.ts          # CRUD de clientes
│   │   │   └── [id]/route.ts     # Operações por ID
│   │   └── upload/
│   │       └── route.ts          # Upload local
│   ├── cadastro/
│   │   └── page.tsx              # Página de cadastro
│   ├── editar/
│   │   └── [id]/page.tsx         # Página de edição
│   ├── globals.css               # Estilos globais
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Página inicial (lista)
├── components/
│   ├── ClienteCard.tsx           # Card do cliente
│   └── FileUpload.tsx            # Componente de upload
├── data/
│   └── clientes.json             # Dados dos clientes
└── package.json
```

## 🎯 Como Usar

### Cadastrar Cliente
1. Acesse a página inicial
2. Clique em "Novo Cliente"
3. Preencha os dados obrigatórios (nome e CPF)
4. Selecione um arquivo (opcional)
5. Clique em "Salvar Cliente"

### Listar Clientes
1. Na página inicial, visualize todos os clientes
2. Use a barra de busca para filtrar por nome, CPF ou telefone
3. Navegue pelas páginas usando a paginação

### Editar Cliente
1. Na lista de clientes, clique no ícone de edição
2. Modifique os dados necessários
3. Selecione um novo arquivo (opcional)
4. Clique em "Salvar Alterações"

### Deletar Cliente
1. Na lista de clientes, clique no ícone de lixeira
2. Confirme a exclusão
3. O cliente e seus arquivos serão removidos

## 🔧 API Endpoints

### Clientes
- `GET /api/clientes` - Listar clientes (com paginação e busca)
- `POST /api/clientes` - Criar novo cliente
- `GET /api/clientes/[id]` - Buscar cliente por ID
- `PUT /api/clientes/[id]` - Atualizar cliente
- `DELETE /api/clientes/[id]` - Deletar cliente

### Upload
- `POST /api/upload` - Upload de arquivo local

## 📊 Modelo de Dados

```typescript
interface Cliente {
  id: string;
  nome: string;                    // Nome completo (obrigatório)
  cpf?: string;                    // CPF formatado (opcional, único)
  telefone?: string;               // Telefone formatado
  endereco?: string;               // Endereço completo
  dataNascimento?: string;         // Data de nascimento
  observacoes?: string;            // Observações opcionais
  anexos?: Array<{                 // Arquivos anexados
    nome: string;
    url: string;
    tipo: string;
    tamanho: number;
    mimeType: string;
    dataUpload: string;
  }>;
  dataCadastro: string;            // Data de cadastro
}
```

## 🚨 Limitações e Validações

- **Tamanho máximo do arquivo**: 50MB
- **Tipos de arquivo suportados**: 
  - Imagens: JPG, PNG, GIF, WebP
  - Documentos: PDF, DOC, DOCX
  - Vídeos: MP4, AVI, MOV, WMV
- **CPF único**: Não permite CPFs duplicados
- **Telefone**: Formato (XX) XXXXX-XXXX
- **CPF**: Formato XXX.XXX.XXX-XX
- **Observações**: Máximo 500 caracteres

## 🐛 Solução de Problemas

### Erro de validação
- Verifique se todos os campos obrigatórios estão preenchidos
- Confirme o formato do CPF e telefone

### Erro de upload
- Verifique se o diretório `public/uploads` existe
- Confirme se há espaço suficiente no disco

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas, abra uma issue no repositório.

---

**Desenvolvido com ❤️ usando Next.js e armazenamento local**