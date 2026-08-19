#!/usr/bin/env node

/**
 * Script de Verificação de Prontidão para Deploy
 * Verifica se todas as configurações necessárias estão corretas
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando prontidão para deploy...\n');

let errors = 0;
let warnings = 0;

// 1. Verificar se package.json existe
console.log('📦 Verificando package.json...');
if (fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('✅ package.json encontrado');
  console.log(`   Nome: ${pkg.name}`);
  console.log(`   Versão: ${pkg.version}`);
  
  // Verificar scripts
  if (pkg.scripts && pkg.scripts.build && pkg.scripts.start) {
    console.log('✅ Scripts de build e start configurados');
  } else {
    console.log('❌ Scripts de build ou start não encontrados');
    errors++;
  }
} else {
  console.log('❌ package.json não encontrado');
  errors++;
}

console.log('');

// 2. Verificar next.config.js
console.log('⚙️  Verificando next.config.js...');
if (fs.existsSync('next.config.js')) {
  console.log('✅ next.config.js encontrado');
} else {
  console.log('⚠️  next.config.js não encontrado (usando configuração padrão)');
  warnings++;
}

console.log('');

// 3. Verificar vercel.json
console.log('🚀 Verificando vercel.json...');
if (fs.existsSync('vercel.json')) {
  console.log('✅ vercel.json encontrado');
} else {
  console.log('⚠️  vercel.json não encontrado (Vercel usará configuração padrão)');
  warnings++;
}

console.log('');

// 4. Verificar variáveis de ambiente
console.log('🔐 Verificando variáveis de ambiente...');
if (fs.existsSync('env.local') || fs.existsSync('.env.local')) {
  console.log('✅ Arquivo de variáveis de ambiente encontrado localmente');
  console.log('⚠️  Lembre-se de configurar as variáveis na Vercel!');
  warnings++;
} else {
  console.log('⚠️  Arquivo .env.local não encontrado localmente');
  console.log('   Configure as variáveis de ambiente na Vercel');
  warnings++;
}

console.log('');

// 5. Verificar estrutura de pastas
console.log('📁 Verificando estrutura de pastas...');
const requiredDirs = ['app', 'components', 'contexts', 'public'];
const missingDirs = requiredDirs.filter(dir => !fs.existsSync(dir));

if (missingDirs.length === 0) {
  console.log('✅ Todas as pastas necessárias existem');
} else {
  console.log(`❌ Pastas faltando: ${missingDirs.join(', ')}`);
  errors++;
}

console.log('');

// 6. Verificar dependências críticas
console.log('📚 Verificando dependências críticas...');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const criticalDeps = ['next', 'react', 'react-dom', 'mongoose', 'cloudinary'];
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  
  const missingDeps = criticalDeps.filter(dep => !deps[dep]);
  
  if (missingDeps.length === 0) {
    console.log('✅ Todas as dependências críticas instaladas');
  } else {
    console.log(`❌ Dependências faltando: ${missingDeps.join(', ')}`);
    errors++;
  }
} catch (e) {
  console.log('❌ Erro ao verificar dependências');
  errors++;
}

console.log('');

// 7. Verificar arquivos de autenticação
console.log('🔒 Verificando sistema de autenticação...');
const authFiles = [
  'contexts/AuthContext.tsx',
  'app/login/page.tsx',
  'components/AuthWrapper.tsx'
];

const missingAuthFiles = authFiles.filter(file => !fs.existsSync(file));

if (missingAuthFiles.length === 0) {
  console.log('✅ Sistema de autenticação completo');
} else {
  console.log(`❌ Arquivos de autenticação faltando: ${missingAuthFiles.join(', ')}`);
  errors++;
}

console.log('');

// 8. Verificar .gitignore
console.log('📝 Verificando .gitignore...');
if (fs.existsSync('.gitignore')) {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  if (gitignore.includes('node_modules') && gitignore.includes('.env')) {
    console.log('✅ .gitignore configurado corretamente');
  } else {
    console.log('⚠️  .gitignore pode estar incompleto');
    warnings++;
  }
} else {
  console.log('❌ .gitignore não encontrado');
  errors++;
}

console.log('');
console.log('═══════════════════════════════════════');
console.log('📊 RESUMO DA VERIFICAÇÃO');
console.log('═══════════════════════════════════════');
console.log(`❌ Erros: ${errors}`);
console.log(`⚠️  Avisos: ${warnings}`);

if (errors === 0) {
  console.log('\n✅ ✅ ✅ PROJETO PRONTO PARA DEPLOY! ✅ ✅ ✅\n');
  console.log('Próximos passos:');
  console.log('1. Faça commit das alterações: git add . && git commit -m "chore: prepara para deploy"');
  console.log('2. Faça push: git push origin master');
  console.log('3. Acesse https://vercel.com e importe o projeto');
  console.log('4. Configure as variáveis de ambiente');
  console.log('5. Faça o deploy!');
} else {
  console.log('\n❌ CORRIJA OS ERROS ANTES DE FAZER DEPLOY\n');
  process.exit(1);
}

console.log('\n📖 Para mais informações, veja DEPLOY_WEB.md\n');

