# 📹 Configuração do Cloudinary para Armazenamento de Vídeos

Este guia te ajudará a configurar o Cloudinary para que seus vídeos sejam acessíveis de qualquer lugar.

## 🌐 O que é o Cloudinary?

O Cloudinary é um serviço de gerenciamento de mídia na nuvem que oferece:
- ✅ Armazenamento gratuito generoso (25GB + 25GB de banda)
- ✅ CDN global para acesso rápido de qualquer lugar
- ✅ Otimização automática de vídeos
- ✅ URLs públicas acessíveis 24/7
- ✅ Suporte a múltiplos formatos de vídeo

## 🚀 Passo 1: Criar Conta no Cloudinary

1. Acesse: https://cloudinary.com/
2. Clique em "Sign Up For Free"
3. Preencha os dados necessários
4. Confirme seu email

## 🔑 Passo 2: Obter Credenciais

Após fazer login no Cloudinary:

1. Vá para o **Dashboard**
2. Na seção "Account Details", você encontrará:
   - **Cloud Name**: Seu nome de nuvem único
   - **API Key**: Chave da API
   - **API Secret**: Segredo da API

## ⚙️ Passo 3: Configurar Variáveis de Ambiente

Edite o arquivo `env.local` e substitua as credenciais:

```env
# Cloudinary
CLOUDINARY_CLOUD_NAME=seu_cloud_name_aqui
CLOUDINARY_API_KEY=sua_api_key_aqui
CLOUDINARY_API_SECRET=seu_api_secret_aqui
```

## 🔄 Passo 4: Migrar Clientes e Vídeos Existentes

Para migrar todos os clientes e seus vídeos para o Cloudinary:

```bash
# Instalar dependência necessária
npm install -D tsx

# Executar migração completa
node scripts/migrate-clientes-videos.js
```

Este script irá:
- ✅ Processar todos os clientes do arquivo `clientes.json`
- ✅ Migrar todos os vídeos e imagens para o Cloudinary
- ✅ Atualizar as URLs no arquivo de clientes
- ✅ Criar backup automático do arquivo original
- ✅ Gerar relatório detalhado da migração
- ✅ Manter arquivos originais como backup

### 📊 O que acontece durante a migração:

1. **Backup Automático**: Cria cópia do `clientes.json` original
2. **Processamento**: Analisa cada cliente e seus anexos
3. **Upload**: Envia cada vídeo/imagem para o Cloudinary
4. **Atualização**: Substitui URLs locais por URLs do Cloudinary
5. **Relatório**: Gera relatório detalhado com estatísticas

### 🎯 Resultado esperado:
- **85+ clientes** processados
- **100+ vídeos** migrados para a nuvem
- **URLs atualizadas** automaticamente
- **Acesso global** a todos os vídeos

## 📱 Passo 5: Testar o Sistema

Após a configuração:

1. **Reinicie o servidor**:
   ```bash
   npm run dev
   ```

2. **Teste um novo upload**:
   - Vá para a página de cadastro
   - Faça upload de um vídeo
   - Verifique se a URL gerada é do Cloudinary

3. **Verifique acesso externo**:
   - Copie a URL do vídeo
   - Teste em outro dispositivo/rede
   - Deve funcionar de qualquer lugar

## 🌍 URLs dos Vídeos

Após a migração, suas URLs serão assim:

**Antes (local)**:
```
http://localhost:3000/uploads/1757427769981-Nildoir.mp4
```

**Depois (Cloudinary)**:
```
https://res.cloudinary.com/seu_cloud_name/video/upload/v1234567890/clientes-videos/1757427769981-Nildoir.mp4
```

## 📊 Vantagens da Migração

### ✅ Acesso Global
- Vídeos acessíveis de qualquer lugar do mundo
- URLs funcionam mesmo sem o servidor local rodando

### ✅ Performance
- CDN global para carregamento rápido
- Otimização automática de vídeos

### ✅ Confiabilidade
- Backup automático na nuvem
- 99.9% de uptime garantido

### ✅ Escalabilidade
- Suporta milhões de visualizações
- Sem limitações de espaço do servidor local

## 🔧 Solução de Problemas

### Erro: "Invalid credentials"
- Verifique se as credenciais no `env.local` estão corretas
- Certifique-se de que não há espaços extras

### Erro: "Upload failed"
- Verifique sua conexão com a internet
- Confirme que o arquivo não excede 100MB (limite gratuito)

### Vídeos não aparecem
- Aguarde alguns minutos para a propagação do CDN
- Verifique se a URL foi gerada corretamente

## 📈 Monitoramento

No dashboard do Cloudinary você pode:
- Ver estatísticas de uso
- Monitorar bandeira consumida
- Gerenciar arquivos
- Configurar transformações

## 💰 Custos

**Plano Gratuito inclui**:
- 25GB de armazenamento
- 25GB de banda por mês
- Transformações ilimitadas
- CDN global

Para a maioria dos casos, o plano gratuito é suficiente!

---

🎉 **Pronto!** Seus vídeos agora estão na nuvem e acessíveis de qualquer lugar!
