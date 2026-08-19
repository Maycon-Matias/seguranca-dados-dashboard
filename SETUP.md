# Configuração do Sistema de Clientes

## Problemas Identificados e Soluções

### 1. Arquivo de Configuração (.env.local)
O arquivo `.env.local` não existe, que é necessário para a conexão com o MongoDB.

**Solução:**
Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/sistema-clientes

# Google Drive API (opcional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
GOOGLE_REFRESH_TOKEN=your_refresh_token
GOOGLE_DRIVE_FOLDER_ID=your_drive_folder_id

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### 2. MongoDB
Certifique-se de que o MongoDB está rodando na sua máquina.

**Para instalar e executar o MongoDB:**
- Windows: Baixe e instale o MongoDB Community Server
- Ou use Docker: `docker run -d -p 27017:27017 --name mongodb mongo:latest`

### 3. Correções Aplicadas

#### Interface de Dados
- Corrigida a incompatibilidade entre o modelo do banco (que usa `anexos` como array) e o frontend
- Atualizada a interface `Cliente` para usar `anexos?: Anexo[]` em vez de campos individuais de arquivo
- **Modificado o modelo para deixar apenas o campo `nome` como obrigatório**
- Todos os outros campos (email, telefone, endereço, data de nascimento) agora são opcionais

#### Configuração do Tailwind
- Adicionadas cores primárias que estavam faltando (`primary-100`, `primary-800`)

## Como Executar

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure o arquivo .env.local** (veja seção 1)

3. **Execute o MongoDB** (veja seção 2)

4. **Execute o projeto:**
   ```bash
   npm run dev
   ```

5. **Acesse:** http://localhost:3000

## Estrutura do Projeto

- `app/` - Páginas e rotas da API do Next.js
- `components/` - Componentes React reutilizáveis
- `lib/` - Utilitários (MongoDB, Google Drive)
- `models/` - Modelos do Mongoose
- `app/api/` - Rotas da API

## Funcionalidades

- ✅ Listagem de clientes com paginação
- ✅ Busca por nome, email ou telefone
- ✅ Cadastro de novos clientes
- ✅ Edição de clientes existentes
- ✅ Upload de arquivos (anexos)
- ✅ Interface responsiva com Tailwind CSS
