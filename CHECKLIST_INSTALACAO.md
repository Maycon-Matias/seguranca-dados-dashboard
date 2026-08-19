# ✅ Checklist de Instalação - Sistema de Clientes

## 🚀 **Instalação Simples (Funciona Imediatamente)**

### **1. Verificar Pré-requisitos**
- [ ] Node.js 18+ instalado
  ```bash
  node --version
  npm --version
  ```
- [ ] Git instalado (opcional)

### **2. Instalar Dependências**
- [ ] Executar no terminal:
  ```bash
  npm install
  ```

### **3. Executar o Sistema**
- [ ] Iniciar servidor:
  ```bash
  npm run dev
  ```
- [ ] Acessar: http://localhost:3000
- [ ] ✅ **Sistema funcionando com arquivos JSON locais**

---

## 🎯 **Teste das Funcionalidades**

### **Cadastro de Cliente**
- [ ] Acessar página inicial
- [ ] Clicar em "Novo Cliente"
- [ ] Preencher nome (obrigatório)
- [ ] Preencher CPF (opcional, formato: 000.000.000-00)
- [ ] Preencher telefone (opcional, formato: (00) 00000-0000)
- [ ] Preencher endereço (opcional)
- [ ] Preencher data de nascimento (opcional)
- [ ] Preencher observações (opcional)
- [ ] Selecionar arquivo (opcional)
- [ ] Clicar em "Salvar Cliente"
- [ ] ✅ Cliente cadastrado com sucesso

### **Listagem e Busca**
- [ ] Visualizar lista de clientes na página inicial
- [ ] Testar busca por nome
- [ ] Testar busca por CPF
- [ ] Testar busca por telefone
- [ ] Navegar pela paginação (se houver muitos clientes)

### **Edição de Cliente**
- [ ] Clicar no ícone de edição de um cliente
- [ ] Modificar dados
- [ ] Adicionar/remover arquivos
- [ ] Clicar em "Salvar Alterações"
- [ ] ✅ Alterações salvas com sucesso

### **Exclusão de Cliente**
- [ ] Clicar no ícone de lixeira de um cliente
- [ ] Confirmar exclusão
- [ ] ✅ Cliente e arquivos removidos

### **Upload de Arquivos**
- [ ] Testar upload de imagem (JPG, PNG, GIF, WebP)
- [ ] Testar upload de documento (PDF, DOC, DOCX)
- [ ] Testar upload de vídeo (MP4, AVI, MOV, WMV)
- [ ] Verificar preview de imagens
- [ ] ✅ Arquivos salvos em `public/uploads/`

---

## 📁 **Estrutura de Arquivos**

```
sistema-clientes/
├── app/                    # Páginas e API routes
├── components/             # Componentes React
├── data/                   # Dados JSON
│   └── clientes.json      # Dados dos clientes
├── public/                 # Arquivos estáticos
│   └── uploads/           # Arquivos enviados
└── package.json           # Dependências
```

---

## 🔧 **Comandos Úteis**

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start

# Verificar linting
npm run lint
```

---

## 🚨 **Solução de Problemas**

### **Erro: "Cannot find module"**
- [ ] Executar `npm install` novamente
- [ ] Verificar se Node.js está atualizado

### **Erro: "Port 3000 already in use"**
- [ ] Parar outros processos na porta 3000
- [ ] Ou usar porta diferente: `npm run dev -- -p 3001`

### **Erro de upload de arquivo**
- [ ] Verificar se diretório `public/uploads` existe
- [ ] Verificar permissões de escrita
- [ ] Verificar tamanho do arquivo (máx: 50MB)

### **Dados não aparecem**
- [ ] Verificar se arquivo `data/clientes.json` existe
- [ ] Verificar se servidor está rodando
- [ ] Recarregar página (F5)

---

## ✅ **Sistema Pronto!**

Após completar este checklist, você terá:

- ✅ Sistema de clientes funcionando
- ✅ Cadastro com CPF em vez de email
- ✅ Upload de arquivos local
- ✅ Busca por nome, CPF e telefone
- ✅ Interface moderna e responsiva
- ✅ Dados armazenados localmente em JSON

**🎉 Parabéns! Seu sistema está funcionando perfeitamente!**