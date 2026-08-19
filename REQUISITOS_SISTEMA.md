# 📋 Requisitos e Dependências do Sistema de Clientes

## 🖥️ **Requisitos de Sistema**

### **Sistema Operacional:**
- Windows 10/11, macOS 10.15+, ou Linux Ubuntu 18.04+
- Mínimo 4GB RAM (recomendado 8GB+)
- 2GB de espaço livre em disco

### **Software Base:**
- **Node.js 18.0+** (obrigatório)
- **npm 8.0+** ou **yarn 1.22+** (gerenciador de pacotes)

## 🗄️ **Banco de Dados (Opcional)**

### **Opção 1: Sistema Atual (Arquivos JSON)**
- ✅ **Já configurado e funcionando**
- Não requer instalação adicional
- Dados armazenados em `data/clientes.json`
- **Limitação:** Não recomendado para produção com muitos usuários

### **Opção 2: MongoDB (Recomendado para Produção)**

#### **MongoDB Local:**
```bash
# Windows
# Baixar e instalar: https://www.mongodb.com/try/download/community

# macOS
brew install mongodb-community

# Linux Ubuntu
sudo apt-get install mongodb
```

#### **MongoDB Atlas (Nuvem - Recomendado):**
1. Criar conta gratuita em: https://www.mongodb.com/atlas
2. Criar cluster gratuito
3. Obter string de conexão
4. Configurar no arquivo `.env.local`

**String de conexão exemplo:**
```
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/sistema-clientes
```

## ☁️ **Google Drive API (Opcional)**

### **Para Upload de Arquivos na Nuvem:**

1. **Criar Projeto no Google Cloud Console:**
   - Acesse: https://console.cloud.google.com/
   - Criar novo projeto ou selecionar existente

2. **Habilitar Google Drive API:**
   - Ir em "APIs & Services" > "Library"
   - Buscar "Google Drive API"
   - Clicar em "Enable"

3. **Criar Credenciais:**
   - Ir em "APIs & Services" > "Credentials"
   - Clicar "Create Credentials" > "OAuth 2.0 Client ID"
   - Tipo: "Web application"
   - Adicionar URI de redirecionamento: `http://localhost:3000/api/auth/google/callback`

4. **Obter Refresh Token:**
   - Acesse: https://developers.google.com/oauthplayground/
   - Configurar OAuth 2.0
   - Selecionar Google Drive API v3
   - Autorizar e obter refresh token

5. **Configurar Variáveis:**
```env
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
GOOGLE_REFRESH_TOKEN=seu_refresh_token_aqui
GOOGLE_DRIVE_FOLDER_ID=id_da_pasta_no_drive
```

## 🔧 **Configuração do Ambiente**

### **1. Instalar Dependências:**
```bash
npm install
```

### **2. Arquivo de Configuração (.env.local):**
```env
# MongoDB (opcional - se usar MongoDB)
MONGODB_URI=mongodb://localhost:27017/sistema-clientes

# Google Drive API (opcional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
GOOGLE_REFRESH_TOKEN=your_refresh_token
GOOGLE_DRIVE_FOLDER_ID=your_drive_folder_id

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key_here
```

### **3. Executar o Sistema:**
```bash
npm run dev
```

## 📦 **Dependências do Projeto (já instaladas)**

### **Produção:**
- `next: 14.0.4` - Framework React
- `react: ^18` - Biblioteca React
- `react-dom: ^18` - DOM do React
- `mongoose: ^8.0.3` - ODM para MongoDB
- `googleapis: ^128.0.0` - API do Google
- `multer: ^1.4.5-lts.1` - Upload de arquivos
- `formidable: ^3.5.1` - Parsing de formulários
- `lucide-react: ^0.294.0` - Ícones
- `tailwindcss: ^3.3.6` - Framework CSS

### **Desenvolvimento:**
- `typescript: ^5` - TypeScript
- `@types/node: ^20` - Tipos do Node.js
- `@types/react: ^18` - Tipos do React
- `@types/react-dom: ^18` - Tipos do React DOM
- `@types/multer: ^1.4.11` - Tipos do Multer
- `eslint: ^8` - Linter
- `eslint-config-next: 14.0.4` - Configuração ESLint para Next.js

## 🚀 **Cenários de Uso**

### **Desenvolvimento/Teste (Mínimo):**
- ✅ Node.js 18+
- ✅ npm install
- ✅ npm run dev
- **Resultado:** Sistema funcionando com arquivos JSON

### **Produção Básica:**
- ✅ Node.js 18+
- ✅ MongoDB (local ou Atlas)
- ✅ Configurar MONGODB_URI
- **Resultado:** Sistema com banco de dados persistente

### **Produção Completa:**
- ✅ Node.js 18+
- ✅ MongoDB (local ou Atlas)
- ✅ Google Drive API configurada
- ✅ Todas as variáveis de ambiente
- **Resultado:** Sistema completo com upload na nuvem

## 🔒 **Segurança e Produção**

### **Variáveis de Ambiente Obrigatórias para Produção:**
```env
NEXTAUTH_SECRET=chave_secreta_forte_aqui
MONGODB_URI=string_de_conexao_segura
```

### **Recomendações:**
- Usar HTTPS em produção
- Configurar CORS adequadamente
- Implementar autenticação/autorização
- Backup regular dos dados
- Monitoramento de logs

## 📊 **Limitações e Considerações**

### **Sistema Atual (JSON):**
- ✅ Funciona imediatamente
- ❌ Não escalável para muitos usuários
- ❌ Sem backup automático
- ❌ Sem transações

### **MongoDB:**
- ✅ Escalável
- ✅ Backup automático
- ✅ Transações
- ❌ Requer configuração adicional

### **Google Drive:**
- ✅ Armazenamento ilimitado
- ✅ Backup automático
- ✅ Acesso global
- ❌ Requer configuração complexa
- ❌ Dependente de API externa

## 🎯 **Recomendação Final**

**Para começar imediatamente:**
1. Node.js 18+
2. `npm install`
3. `npm run dev`
4. Acessar http://localhost:3000

**Para produção:**
1. Adicionar MongoDB (Atlas recomendado)
2. Configurar Google Drive API
3. Implementar autenticação
4. Configurar HTTPS
5. Implementar backup e monitoramento
