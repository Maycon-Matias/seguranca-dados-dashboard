# 🗄️ Configuração MongoDB Atlas - Sistema de Clientes

## 📋 **Passo a Passo para Usar seu MongoDB Atlas Existente**

### **1. Obter String de Conexão do MongoDB Atlas**

1. **Acesse seu MongoDB Atlas:**
   - Vá para: https://cloud.mongodb.com/
   - Faça login na sua conta

2. **Selecionar seu Cluster:**
   - Clique no cluster que você quer usar
   - Clique em "Connect"

3. **Escolher Método de Conexão:**
   - Selecione "Connect your application"
   - Escolha "Node.js" como driver
   - Copie a string de conexão

4. **Exemplo de String de Conexão:**
   ```
   mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### **2. Configurar Variáveis de Ambiente**

1. **Criar arquivo `.env.local` na raiz do projeto:**
   ```env
   # MongoDB Atlas - Substitua pela sua string de conexão
   MONGODB_URI=mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/sistema-clientes?retryWrites=true&w=majority
   
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

2. **Importante:** 
   - Substitua `usuario` e `senha` pelas suas credenciais
   - Substitua `cluster0.xxxxx` pelo seu cluster
   - Adicione `/sistema-clientes` no final para criar um database específico

### **3. Configurar Permissões no MongoDB Atlas**

1. **Adicionar IP ao Whitelist:**
   - No MongoDB Atlas, vá em "Network Access"
   - Clique em "Add IP Address"
   - Para desenvolvimento, adicione `0.0.0.0/0` (permite qualquer IP)
   - Para produção, adicione apenas IPs específicos

2. **Verificar Usuário do Banco:**
   - Vá em "Database Access"
   - Certifique-se que seu usuário tem permissões de leitura/escrita
   - Se necessário, crie um novo usuário

### **4. Migrar Dados Existentes (Opcional)**

Se você tem dados no arquivo JSON e quer migrar para o MongoDB:

1. **Executar script de migração:**
   ```bash
   # Definir variável de ambiente
   export MONGODB_URI="sua_string_de_conexao_aqui"
   
   # Executar migração
   node scripts/migrate-to-mongodb.js
   ```

2. **Ou usar PowerShell (Windows):**
   ```powershell
   $env:MONGODB_URI="sua_string_de_conexao_aqui"
   node scripts/migrate-to-mongodb.js
   ```

### **5. Testar Conexão**

1. **Iniciar o sistema:**
   ```bash
   npm run dev
   ```

2. **Verificar logs:**
   - Se a conexão estiver OK, você verá logs de sucesso
   - Se houver erro, verifique a string de conexão

3. **Testar API:**
   ```bash
   curl http://localhost:3000/api/clientes
   ```

### **6. Estrutura do Database no MongoDB Atlas**

O sistema criará automaticamente:

- **Database:** `sistema-clientes` (ou o nome que você especificar)
- **Collection:** `clientes`
- **Índices:** 
  - `email` (único)
  - `nome`
  - `dataCadastro`

### **7. Exemplo de Documento no MongoDB**

```json
{
  "_id": ObjectId("..."),
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "(11) 99999-9999",
  "endereco": "Rua das Flores, 123",
  "dataNascimento": ISODate("1990-05-15T00:00:00.000Z"),
  "observacoes": "Cliente preferencial",
  "anexos": [
    {
      "nome": "documento.pdf",
      "url": "/uploads/documento.pdf",
      "tipo": "document",
      "tamanho": 245760,
      "mimeType": "application/pdf",
      "dataUpload": ISODate("2024-01-15T10:30:00.000Z")
    }
  ],
  "dataCadastro": ISODate("2024-01-15T10:30:00.000Z")
}
```

## 🔧 **Comandos Úteis**

### **Verificar Conexão:**
```bash
# Testar conexão direta
mongosh "sua_string_de_conexao"
```

### **Ver Dados no MongoDB Atlas:**
1. Acesse o MongoDB Atlas
2. Vá em "Browse Collections"
3. Selecione seu database e collection
4. Visualize os documentos

### **Limpar Dados (se necessário):**
```bash
# Conectar ao MongoDB
mongosh "sua_string_de_conexao"

# Selecionar database
use sistema-clientes

# Ver collections
show collections

# Limpar collection (cuidado!)
db.clientes.deleteMany({})
```

## 🚨 **Solução de Problemas**

### **Erro: "Authentication failed"**
- Verifique usuário e senha na string de conexão
- Confirme que o usuário tem permissões no database

### **Erro: "Network timeout"**
- Verifique se seu IP está no whitelist
- Confirme que a string de conexão está correta

### **Erro: "Database not found"**
- O database será criado automaticamente
- Verifique se a string de conexão inclui o nome do database

### **Erro: "Connection refused"**
- Verifique se o cluster está rodando
- Confirme que não há problemas de rede

## ✅ **Checklist de Configuração**

- [ ] String de conexão copiada do MongoDB Atlas
- [ ] Arquivo `.env.local` criado com MONGODB_URI
- [ ] IP adicionado ao whitelist
- [ ] Usuário com permissões configurado
- [ ] Sistema testado e funcionando
- [ ] Dados migrados (se necessário)

## 🎯 **Próximos Passos**

Após configurar o MongoDB Atlas:

1. **Testar todas as funcionalidades:**
   - Cadastrar cliente
   - Editar cliente
   - Deletar cliente
   - Buscar clientes
   - Upload de arquivos

2. **Verificar no MongoDB Atlas:**
   - Dados sendo salvos corretamente
   - Índices criados automaticamente
   - Performance adequada

3. **Configurar backup (recomendado):**
   - MongoDB Atlas já tem backup automático
   - Configure frequência de backup se necessário

**🎉 Sistema pronto para usar com MongoDB Atlas!**
