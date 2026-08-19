# 🔐 Variáveis de Ambiente

## Template de Configuração

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# ====================================
# MongoDB Atlas
# ====================================
MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster.mongodb.net/Segurança-clientes?retryWrites=true&w=majority

# ====================================
# Cloudinary (Armazenamento de Arquivos)
# ====================================
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret

# ====================================
# Next.js (Produção)
# ====================================
NEXTAUTH_URL=https://seu-dominio.vercel.app
NEXTAUTH_SECRET=gere_uma_chave_secreta_aleatoria_aqui
```

## 📋 Como Obter as Credenciais

### MongoDB Atlas
1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Faça login ou crie uma conta
3. Clique em "Connect" no seu cluster
4. Copie a string de conexão
5. Substitua `<username>` e `<password>` pelas suas credenciais

### Cloudinary
1. Acesse [Cloudinary Console](https://cloudinary.com/console)
2. Faça login ou crie uma conta gratuita
3. No Dashboard, encontre:
   - Cloud Name
   - API Key
   - API Secret
4. Copie e cole no arquivo `.env.local`

### NEXTAUTH_SECRET
Gere uma chave secreta aleatória:
```bash
# No terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🚀 Configuração na Vercel

Ao fazer deploy na Vercel, adicione estas variáveis em:
**Project Settings → Environment Variables**

Variáveis necessárias:
- `MONGODB_URI`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

