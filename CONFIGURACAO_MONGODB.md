# 🗄️ Configuração do MongoDB para Sistema de Clientes

Este guia te ajudará a configurar o MongoDB para ter um banco de dados robusto e escalável.

## 🌟 **Por que MongoDB?**

- ✅ **Performance**: Consultas muito mais rápidas
- ✅ **Escalabilidade**: Suporta milhares de clientes
- ✅ **Segurança**: Dados protegidos e backup automático
- ✅ **Busca Avançada**: Indexação e filtros poderosos
- ✅ **Flexibilidade**: Estrutura de dados flexível
- ✅ **Relacionamentos**: Organização perfeita dos dados

## 🚀 **Opção 1: MongoDB Local (Mais Simples)**

### **Passo 1: Instalar MongoDB**

**Windows:**
1. Baixe o MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Execute o instalador
3. Durante a instalação, marque "Install MongoDB as a Service"

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
```

**Linux (Ubuntu):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

### **Passo 2: Iniciar MongoDB**

**Windows:**
- O MongoDB já inicia automaticamente como serviço

**macOS/Linux:**
```bash
sudo systemctl start mongod
```

### **Passo 3: Verificar Conexão**

```bash
mongosh
```

Se aparecer `>` significa que está funcionando!

## 🌐 **Opção 2: MongoDB Atlas (Recomendado)**

### **Passo 1: Criar Conta**

1. Acesse: https://www.mongodb.com/atlas
2. Clique em "Try Free"
3. Crie sua conta gratuita

### **Passo 2: Criar Cluster**

1. Clique em "Build a Database"
2. Escolha "M0 Sandbox" (gratuito)
3. Selecione uma região próxima ao Brasil
4. Clique em "Create"

### **Passo 3: Configurar Acesso**

1. **Criar usuário:**
   - Vá em "Database Access"
   - Clique em "Add New Database User"
   - Escolha "Password" e crie um usuário/senha
   - Role: "Read and write to any database"

2. **Configurar rede:**
   - Vá em "Network Access"
   - Clique em "Add IP Address"
   - Escolha "Allow access from anywhere" (0.0.0.0/0)

### **Passo 4: Obter String de Conexão**

1. Vá em "Database"
2. Clique em "Connect"
3. Escolha "Connect your application"
4. Copie a string de conexão

Exemplo:
```
mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/sistema-clientes?retryWrites=true&w=majority
```

## ⚙️ **Configurar no Projeto**

### **Editar arquivo `env.local`:**

**Para MongoDB Local:**
```env
MONGODB_URI=mongodb://localhost:27017/sistema-clientes
```

**Para MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/sistema-clientes?retryWrites=true&w=majority
```

## 🔄 **Migrar Dados para MongoDB**

### **Instalar dependências:**
```bash
npm install mongoose
npm install -D tsx
```

### **Executar migração:**
```bash
node scripts/migrate-to-mongodb.js
```

Este script irá:
- ✅ Conectar ao MongoDB
- ✅ Migrar todos os 67 clientes do JSON
- ✅ Criar backup do arquivo original
- ✅ Gerar relatório da migração

## 📊 **Vantagens Após a Migração**

### **Performance:**
- **Busca 10x mais rápida**
- **Paginação otimizada**
- **Índices automáticos**

### **Funcionalidades:**
- **Busca por texto completo**
- **Filtros avançados**
- **Ordenação por qualquer campo**

### **Segurança:**
- **Backup automático**
- **Dados criptografados**
- **Controle de acesso**

### **Escalabilidade:**
- **Milhares de clientes**
- **Múltiplos usuários simultâneos**
- **Crescimento ilimitado**

## 🔍 **Verificar Migração**

Após a migração, você pode verificar os dados:

```bash
mongosh
use sistema-clientes
db.clientes.countDocuments()
db.clientes.find().limit(5)
```

## 📈 **Estatísticas Esperadas**

Após a migração:
- **67 clientes** migrados
- **100+ anexos** organizados
- **Busca instantânea** por nome, CPF ou telefone
- **Performance 10x melhor**

## 🛠️ **Comandos Úteis**

### **Verificar status:**
```bash
# MongoDB local
sudo systemctl status mongod

# MongoDB Atlas
# Verificar no dashboard web
```

### **Backup manual:**
```bash
mongodump --db sistema-clientes --out backup/
```

### **Restaurar backup:**
```bash
mongorestore --db sistema-clientes backup/sistema-clientes/
```

## 🚨 **Solução de Problemas**

### **Erro de conexão:**
- Verifique se o MongoDB está rodando
- Confirme a string de conexão
- Teste a conectividade de rede

### **Erro de autenticação:**
- Verifique usuário e senha
- Confirme permissões do usuário
- Teste conexão no mongosh

### **Erro de rede (Atlas):**
- Adicione seu IP na whitelist
- Use "Allow access from anywhere" para testes

---

🎉 **Pronto!** Agora você tem um banco de dados profissional e escalável!

**MongoDB Local**: Gratuito, rápido, controle total
**MongoDB Atlas**: Gratuito (500MB), backup automático, acesso global
