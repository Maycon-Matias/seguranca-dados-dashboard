# Sistema de Clientes - Funcionando Localmente

## ✅ Status: FUNCIONANDO

O sistema está agora funcionando completamente sem dependências externas (MongoDB ou Google Drive). Todos os dados são armazenados localmente.

## 🚀 Como Usar

### 1. Iniciar o Sistema
```bash
npm run dev
```
O sistema estará disponível em: http://localhost:3000

### 2. Funcionalidades Disponíveis

#### 📋 Página Inicial (http://localhost:3000)
- Lista todos os clientes cadastrados
- Busca por nome, email ou telefone
- Paginação dos resultados
- Estatísticas do sistema
- Botões para editar e deletar clientes

#### ➕ Cadastrar Cliente (http://localhost:3000/cadastro)
- Formulário completo de dados pessoais
- Upload de arquivos (imagens, documentos, vídeos)
- Validação de campos obrigatórios
- Máscara para telefone brasileiro

#### ✏️ Editar Cliente (http://localhost:3000/editar/[id])
- Editar dados existentes
- Adicionar novos arquivos
- Manter arquivos existentes

## 📁 Estrutura de Dados

### Armazenamento Local
- **Clientes**: `data/clientes.json`
- **Arquivos**: `public/uploads/`

### Tipos de Arquivo Suportados
- **Imagens**: JPG, PNG, GIF, WebP
- **Documentos**: PDF, DOC, DOCX
- **Vídeos**: MP4, AVI, MOV, WMV
- **Tamanho máximo**: 50MB por arquivo
- **Limite**: 10 arquivos por cliente

## 🔧 Modificações Realizadas

### 1. API de Upload (`/app/api/upload/route.ts`)
- ✅ Removida dependência do Google Drive
- ✅ Upload local para pasta `public/uploads/`
- ✅ Validação de tipos e tamanhos
- ✅ Geração de nomes únicos para arquivos

### 2. API de Clientes (`/app/api/clientes/route.ts`)
- ✅ Removida dependência do MongoDB
- ✅ Armazenamento em arquivo JSON local
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Busca e paginação

### 3. Componente FileUpload (`/components/FileUpload.tsx`)
- ✅ Funcionando perfeitamente
- ✅ Drag & drop
- ✅ Preview de imagens
- ✅ Validações de tamanho e tipo

### 4. Páginas Frontend
- ✅ Página inicial com lista de clientes
- ✅ Página de cadastro
- ✅ Página de edição
- ✅ Navegação entre páginas

## 🎯 Funcionalidades Testadas

- ✅ Cadastro de cliente com dados pessoais
- ✅ Upload de arquivos (imagens, documentos, vídeos)
- ✅ Listagem de clientes com busca
- ✅ Edição de dados do cliente
- ✅ Exclusão de cliente e arquivos
- ✅ Validação de formulários
- ✅ Responsividade da interface

## 📱 Interface

- **Design moderno** com Tailwind CSS
- **Responsivo** para desktop e mobile
- **Ícones** do Lucide React
- **Validações visuais** em tempo real
- **Feedback** de sucesso e erro

## 🔄 Como Funciona

1. **Cadastro**: Preencha os dados e selecione arquivos
2. **Upload**: Arquivos são salvos em `public/uploads/`
3. **Armazenamento**: Dados do cliente salvos em `data/clientes.json`
4. **Listagem**: Clientes aparecem na página inicial
5. **Edição**: Clique no ícone de editar para modificar
6. **Exclusão**: Cliente e arquivos são removidos permanentemente

## 🚨 Importante

- Os dados são armazenados localmente
- Faça backup do arquivo `data/clientes.json` se necessário
- Os arquivos ficam em `public/uploads/`
- O sistema funciona offline após o primeiro carregamento

## 🎉 Pronto para Usar!

O sistema está completamente funcional e pode ser usado imediatamente. Todas as funcionalidades de upload de arquivos e gerenciamento de clientes estão operacionais.
