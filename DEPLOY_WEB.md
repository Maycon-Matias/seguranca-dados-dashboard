# 🌐 Guia Completo de Deploy Web

Este guia mostra como colocar o sistema online usando a **Vercel** (gratuito e otimizado para Next.js).

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:
- ✅ Conta no GitHub (o código já está no repositório)
- ✅ MongoDB Atlas configurado
- ✅ Cloudinary configurado (para uploads de arquivos)

---

## 🚀 Método 1: Deploy via Vercel (Recomendado)

### Passo 1: Criar Conta na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Sign Up"**
3. Escolha **"Continue with GitHub"**
4. Autorize a Vercel a acessar sua conta GitHub

### Passo 2: Importar o Projeto

1. No dashboard da Vercel, clique em **"Add New Project"**
2. Selecione **"Import Git Repository"**
3. Encontre o repositório: `Pora-Cred/Dados-de-Seguran-a`
4. Clique em **"Import"**

### Passo 3: Configurar Variáveis de Ambiente

Na página de configuração do projeto, adicione as seguintes variáveis:

#### Variáveis Obrigatórias:

```
MONGODB_URI = mongodb+srv://admin:admin123@poracred.lep058a.mongodb.net/Segurança-clientes?retryWrites=true&w=majority

CLOUDINARY_CLOUD_NAME = seu_cloud_name_aqui
CLOUDINARY_API_KEY = sua_api_key_aqui
CLOUDINARY_API_SECRET = seu_api_secret_aqui
```

**Como adicionar:**
1. Role até **"Environment Variables"**
2. Para cada variável:
   - Digite o **Nome** (ex: `MONGODB_URI`)
   - Digite o **Value** (ex: sua string de conexão)
   - Selecione **Production, Preview, Development**
   - Clique em **"Add"**

### Passo 4: Deploy

1. Clique em **"Deploy"**
2. Aguarde 2-3 minutos (a Vercel irá):
   - ✅ Instalar dependências
   - ✅ Compilar o projeto
   - ✅ Fazer deploy

### Passo 5: Acessar o Sistema

Após o deploy, você receberá uma URL como:
```
https://seu-projeto.vercel.app
```

🔐 **Código de acesso padrão:** `1234`

---

## 🔧 Método 2: Deploy Manual via CLI

### Instalar Vercel CLI

```bash
npm install -g vercel
```

### Fazer Login

```bash
vercel login
```

### Deploy

```bash
vercel --prod
```

### Configurar Variáveis de Ambiente

```bash
vercel env add MONGODB_URI
vercel env add CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET
```

---

## 🌍 Método 3: Domínio Personalizado

### Adicionar Domínio Próprio

1. No dashboard da Vercel, acesse seu projeto
2. Clique em **"Settings"** → **"Domains"**
3. Digite seu domínio (ex: `clientes.suaempresa.com.br`)
4. Siga as instruções para configurar o DNS

### Configurar DNS

Adicione os seguintes registros no seu provedor de DNS:

**Tipo A:**
```
@ → 76.76.21.21
```

**Tipo CNAME:**
```
www → cname.vercel-dns.com
```

---

## 📱 Método 4: Acesso Local na Rede

Para acessar o sistema localmente de outros dispositivos na mesma rede:

### Descobrir seu IP local

**Windows:**
```bash
ipconfig
```
Procure por "Endereço IPv4" (ex: 192.168.1.100)

**Linux/Mac:**
```bash
ifconfig
```

### Iniciar servidor com IP da rede

```bash
npm run dev -- -H 0.0.0.0
```

### Acessar de outros dispositivos

No navegador de qualquer dispositivo na mesma rede:
```
http://192.168.1.100:3000
```

**⚠️ Aviso:** Este método só funciona na rede local, não é acessível pela internet.

---

## 🔐 Segurança

### Alterar o Código de Acesso

Edite o arquivo `contexts/AuthContext.tsx`:

```typescript
// Linha 15
const DEFAULT_ACCESS_CODE = '1234'; // Mude para seu código
```

Faça commit e push:
```bash
git add contexts/AuthContext.tsx
git commit -m "chore: atualiza código de acesso"
git push origin master
```

A Vercel fará deploy automático da alteração.

---

## 🎯 Domínios Disponíveis na Vercel (Grátis)

Após o deploy, você terá automaticamente:
- `https://seu-projeto.vercel.app`
- `https://seu-projeto-git-master-seu-usuario.vercel.app`
- Todos os domínios com **HTTPS automático e certificado SSL**

---

## 📊 Monitoramento

### Ver Logs e Erros

1. Acesse o [Dashboard da Vercel](https://vercel.com/dashboard)
2. Selecione seu projeto
3. Clique em **"Deployments"** → Selecione um deploy
4. Clique em **"Logs"** para ver logs em tempo real

### Analytics (Opcional)

A Vercel oferece analytics gratuito:
1. No projeto, clique em **"Analytics"**
2. Veja visitantes, performance, erros

---

## ❓ Solução de Problemas

### Erro: "Cannot connect to MongoDB"
- ✅ Verifique se o `MONGODB_URI` está correto
- ✅ No MongoDB Atlas, adicione `0.0.0.0/0` nas regras de IP (Network Access)

### Erro: "Cloudinary upload failed"
- ✅ Verifique as credenciais do Cloudinary
- ✅ Confirme que a conta está ativa

### Deploy falhou
- ✅ Verifique os logs no dashboard da Vercel
- ✅ Certifique-se de que não há erros de TypeScript
- ✅ Execute `npm run build` localmente para testar

### Site lento
- ✅ A Vercel é otimizada para velocidade
- ✅ Verifique se o MongoDB está na região correta
- ✅ Use `gru1` (São Paulo) para melhor performance no Brasil

---

## 🎉 Pronto!

Seu sistema está online e acessível de qualquer lugar do mundo!

**URL do sistema:** `https://seu-projeto.vercel.app`  
**Código de acesso:** `1234` (altere conforme necessário)

### Próximos Passos

1. ✅ Teste o sistema na URL pública
2. ✅ Configure um domínio personalizado (opcional)
3. ✅ Altere o código de acesso padrão
4. ✅ Compartilhe o link com sua equipe

---

## 📞 Suporte

- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Next.js](https://nextjs.org/docs)
- [Suporte MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
- [Suporte Cloudinary](https://cloudinary.com/documentation)

