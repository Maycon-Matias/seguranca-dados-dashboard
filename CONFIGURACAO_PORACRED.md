# 🏢 Configuração para PoraCred - Segurança-clientes

Este guia é específico para configurar o sistema no banco **Segurança-clientes** do MongoDB Atlas PoraCred.

## 🛡️ **Garantias de Segurança**

- ✅ **Banco específico**: Trabalha apenas com `Segurança-clientes`
- ✅ **CRM protegido**: Nenhum dado do CRM será alterado
- ✅ **Nova coleção**: Apenas `sistema_clientes` será criada
- ✅ **Isolamento total**: Sistema completamente independente

## ⚙️ **Configuração Atual**

### **String de Conexão Configurada:**
```env
MONGODB_URI=mongodb+srv://admin:<db_password>@poracred.lep058a.mongodb.net/Segurança-clientes?retryWrites=true&w=majority&appName=PoraCred
```

### **Estrutura do Banco:**
```
PoraCred Cluster
├── CRM (protegido - não será tocado)
└── Segurança-clientes (banco do sistema)
    └── sistema_clientes (nova coleção)
```

## 🚀 **Como Executar**

### **Passo 1: Substituir Senha**

Edite o arquivo `env.local` e substitua `<db_password>` pela senha real:

```env
MONGODB_URI=mongodb+srv://admin:SUA_SENHA_AQUI@poracred.lep058a.mongodb.net/Segurança-clientes?retryWrites=true&w=majority&appName=PoraCred
```

### **Passo 2: Instalar Dependências**

```bash
npm install mongoose
npm install -D tsx
```

### **Passo 3: Verificar Conexão (Opcional)**

```bash
node scripts/verify-database-safety.js
```

### **Passo 4: Executar Migração**

```bash
node scripts/migrate-to-mongodb.js
```

## 📊 **O que Acontece Durante a Migração**

1. **Conecta** ao MongoDB Atlas PoraCred
2. **Acessa** apenas o banco `Segurança-clientes`
3. **Cria** a coleção `sistema_clientes` (se não existir)
4. **Migra** os 67 clientes do JSON
5. **Preserva** todos os dados do CRM

## 🔍 **Verificação de Segurança**

Após a migração, você pode verificar:

```bash
# Conectar ao MongoDB Atlas
mongosh "mongodb+srv://admin:SUA_SENHA@poracred.lep058a.mongodb.net/"

# Ver bancos disponíveis
show dbs

# Acessar banco Segurança-clientes
use Segurança-clientes

# Ver coleções (apenas sistema_clientes)
show collections

# Ver dados migrados
db.sistema_clientes.countDocuments()
db.sistema_clientes.find().limit(5)
```

## 🛡️ **Garantias Específicas**

### **Banco CRM (Protegido):**
- ❌ **Não será acessado**
- ❌ **Não será modificado**
- ❌ **Não será alterado**

### **Banco Segurança-clientes:**
- ✅ **Apenas nova coleção será criada**
- ✅ **Dados existentes preservados**
- ✅ **Sistema isolado**

## 📈 **Vantagens da Configuração**

### **Para o Sistema de Clientes:**
- ⚡ **Performance MongoDB Atlas**
- 🌍 **Acesso global 24/7**
- 🔒 **Backup automático**
- 📊 **Escalabilidade ilimitada**

### **Para o CRM:**
- 🛡️ **Zero impacto**
- 🔄 **Funcionamento normal**
- 📊 **Dados preservados**
- 🚀 **Performance mantida**

## 🚨 **Em Caso de Problemas**

### **Se algo der errado:**
1. **Pare o sistema** (Ctrl+C)
2. **Remova apenas a nova coleção**:
   ```bash
   mongosh "mongodb+srv://admin:SUA_SENHA@poracred.lep058a.mongodb.net/"
   use Segurança-clientes
   db.sistema_clientes.drop()
   ```

### **CRM permanece intacto:**
- ✅ **Nenhuma alteração no banco CRM**
- ✅ **Funcionamento normal mantido**
- ✅ **Dados preservados**

## 📋 **Checklist de Configuração**

Antes de executar:
- [ ] Substituir `<db_password>` pela senha real
- [ ] Testar conectividade com MongoDB Atlas
- [ ] Verificar permissões de escrita no banco Segurança-clientes
- [ ] Backup do banco (opcional, mas recomendado)

## 🔄 **Reversão Completa**

Se quiser remover tudo do sistema de clientes:

```bash
mongosh "mongodb+srv://admin:SUA_SENHA@poracred.lep058a.mongodb.net/"
use Segurança-clientes
db.sistema_clientes.drop()
```

**Pronto! Apenas a coleção sistema_clientes será removida.**

---

## 🎯 **Resumo da Configuração**

✅ **Banco CRM**: Completamente protegido  
✅ **Banco Segurança-clientes**: Nova coleção isolada  
✅ **Performance**: MongoDB Atlas profissional  
✅ **Segurança**: Zero risco para dados existentes  
✅ **Escalabilidade**: Crescimento ilimitado  

**Configuração perfeita para PoraCred!** 🏢🚀
