# Sistema de Autenticação com Código de 4 Números

## Visão Geral

Foi implementado um sistema de autenticação simples que protege todo o sistema de clientes com um código de 4 números. O sistema é seguro, fácil de usar e mantém a sessão do usuário.

## Funcionalidades Implementadas

### 1. **Página de Login** (`/login`)
- Interface limpa e intuitiva
- Campo para inserir código de 4 números
- Validação em tempo real
- Opção para mostrar/ocultar o código digitado
- Feedback visual de erro e carregamento
- Código padrão: **1234**

### 2. **Contexto de Autenticação** (`contexts/AuthContext.tsx`)
- Gerenciamento global do estado de autenticação
- Persistência da sessão no localStorage
- Funções de login e logout
- Validação do código de acesso

### 3. **Proteção de Rotas** (`components/AuthWrapper.tsx`)
- Redirecionamento automático para login se não autenticado
- Proteção de todas as páginas do sistema
- Layout condicional baseado no status de autenticação
- Botão de logout na navegação

### 4. **Navegação Atualizada**
- Botão "Sair" no cabeçalho
- Ícones intuitivos para melhor UX
- Transições suaves entre estados

## Como Usar

### Acesso Inicial
1. Acesse `http://localhost:3000`
2. Será redirecionado automaticamente para `/login`
3. Digite o código: **1234**
4. Clique em "Entrar no Sistema"

### Alterando o Código de Acesso
Para alterar o código padrão, edite o arquivo `contexts/AuthContext.tsx`:

```typescript
// Linha 12 - Alterar o código padrão
const DEFAULT_ACCESS_CODE = '1234'; // Mude para o código desejado
```

### Logout
- Clique no botão "Sair" no canto superior direito
- A sessão será encerrada e você será redirecionado para o login

## Segurança

- **Validação de Entrada**: Apenas números são aceitos
- **Limite de Caracteres**: Máximo de 4 dígitos
- **Persistência Segura**: Estado salvo no localStorage do navegador
- **Redirecionamento Automático**: Proteção contra acesso direto às URLs

## Estrutura de Arquivos

```
├── contexts/
│   └── AuthContext.tsx          # Contexto de autenticação
├── components/
│   └── AuthWrapper.tsx          # Wrapper de proteção de rotas
├── app/
│   ├── login/
│   │   └── page.tsx             # Página de login
│   └── layout.tsx               # Layout atualizado com AuthProvider
```

## Personalização

### Alterar o Código Padrão
1. Abra `contexts/AuthContext.tsx`
2. Modifique a constante `DEFAULT_ACCESS_CODE`
3. Reinicie o servidor

### Personalizar a Interface
- **Página de Login**: `app/login/page.tsx`
- **Navegação**: `components/AuthWrapper.tsx`
- **Estilos**: Use as classes Tailwind CSS existentes

## Testando o Sistema

1. **Teste de Login Válido**:
   - Acesse `/login`
   - Digite `1234`
   - Deve redirecionar para a página principal

2. **Teste de Login Inválido**:
   - Digite código incorreto
   - Deve mostrar mensagem de erro

3. **Teste de Proteção de Rotas**:
   - Faça logout
   - Tente acessar `/` diretamente
   - Deve redirecionar para login

4. **Teste de Persistência**:
   - Faça login
   - Recarregue a página
   - Deve manter a sessão ativa

## Próximos Passos (Opcionais)

Para tornar o sistema ainda mais robusto, considere:

1. **Código Dinâmico**: Gerar códigos temporários
2. **Múltiplos Usuários**: Sistema de usuários com códigos únicos
3. **Tentativas Limitadas**: Bloquear após X tentativas incorretas
4. **Logs de Acesso**: Registrar tentativas de login
5. **Código por Email/SMS**: Envio automático de códigos

## Suporte

O sistema está totalmente funcional e pronto para uso. Todas as rotas estão protegidas e o código padrão é **1234**.
