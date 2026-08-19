// Configuração de caminhos para arquivos
import { join } from 'path';

/**
 * Retorna todos os caminhos possíveis onde os arquivos podem estar
 */
export function getPossibleFilePaths(filename: string): string[] {
  const caminhos: string[] = [];
  
  // 1. Local padrão do projeto
  caminhos.push(join(process.cwd(), 'public', 'uploads', filename));
  
  // 2. Caminho customizado via variável de ambiente
  const customPath = process.env.UPLOADS_PATH;
  if (customPath) {
    caminhos.push(join(customPath, filename));
    caminhos.push(join(customPath, 'uploads', filename));
  }
  
  // 3. Possíveis locais na raiz do C:
  const possiveisNomes = [
    'Dados Segurança',
    'Dados Seguranca',
    'DadosSegurança',
    'DadosSeguranca',
    'Dados de Segurança',
    'Dados de Seguranca',
  ];
  
  possiveisNomes.forEach(nome => {
    const caminhoBase = join('C:', nome);
    caminhos.push(join(caminhoBase, filename));
    caminhos.push(join(caminhoBase, 'uploads', filename));
    caminhos.push(join(caminhoBase, 'videos', filename));
    caminhos.push(join(caminhoBase, 'arquivos', filename));
  });
  
  // 4. Outros locais comuns
  caminhos.push(join('C:', 'Videos', filename));
  caminhos.push(join('C:', 'Documents', 'Dados Segurança', filename));
  caminhos.push(join(process.env.USERPROFILE || '', 'Documents', 'Dados Segurança', filename));
  caminhos.push(join(process.env.USERPROFILE || '', 'Videos', filename));
  
  return caminhos;
}

/**
 * Busca arquivo em todos os caminhos possíveis (case-insensitive)
 */
export function findFile(filename: string): { path: string | null; searchedPaths: string[] } {
  const { existsSync, readdirSync } = require('fs');
  const caminhos = getPossibleFilePaths(filename);
  const caminhosVerificados: string[] = [];
  
  // Primeiro, busca exata
  for (const caminho of caminhos) {
    caminhosVerificados.push(caminho);
    if (existsSync(caminho)) {
      return { path: caminho, searchedPaths: caminhosVerificados };
    }
  }
  
  // Se não encontrou, busca case-insensitive nas pastas que existem
  const pastasUnicas = new Set<string>();
  caminhos.forEach(caminho => {
    const pasta = require('path').dirname(caminho);
    if (existsSync(pasta)) {
      pastasUnicas.add(pasta);
    }
  });
  
  // Também adicionar pastas conhecidas que podem existir
  const pastasConhecidas = [
    'C:\\Dados Segurança',
    'C:\\Dados Seguranca',
    join(process.cwd(), 'public', 'uploads'),
  ];
  
  pastasConhecidas.forEach(pasta => {
    if (existsSync(pasta)) {
      pastasUnicas.add(pasta);
    }
  });
  
  // Função para normalizar nome (remover timestamp, normalizar espaços/underscores)
  const normalizarNome = (nome: string): string => {
    // Remover timestamp no início (formato: 1234567890-nome)
    let nomeNormalizado = nome.replace(/^\d+-/, '');
    // Se não tem extensão, retornar como está
    if (!nomeNormalizado.includes('.')) {
      return nomeNormalizado.toLowerCase().trim();
    }
    // Remover extensão temporariamente
    const ext = nomeNormalizado.substring(nomeNormalizado.lastIndexOf('.'));
    nomeNormalizado = nomeNormalizado.substring(0, nomeNormalizado.lastIndexOf('.'));
    // Normalizar: remover espaços extras, converter underscore para espaço, tudo minúsculo
    nomeNormalizado = nomeNormalizado
      .replace(/_/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
    return nomeNormalizado + ext.toLowerCase();
  };
  
  const obterExtensao = (nome: string): string => {
    const idx = nome.lastIndexOf('.');
    if (idx === -1) return '';
    return nome.substring(idx + 1).toLowerCase();
  };

  const extensoesEquivalentes: Record<string, string[]> = {
    jpg: ['jpeg'],
    jpeg: ['jpg'],
    png: [],
    gif: [],
    webp: [],
    mp4: [],
    avi: [],
    mov: [],
    wmv: [],
    pdf: [],
    doc: ['docx'],
    docx: ['doc'],
  };

  const extensoesCompativeis = (ext1: string, ext2: string): boolean => {
    if (!ext1 || !ext2) return true;
    if (ext1 === ext2) return true;
    return extensoesEquivalentes[ext1]?.includes(ext2) ?? false;
  };

  // Função para comparar nomes de arquivo (mais flexível)
  const compararNomes = (nome1: string, nome2: string): boolean => {
    const n1 = normalizarNome(nome1);
    const n2 = normalizarNome(nome2);

    const ext1 = obterExtensao(n1);
    const ext2 = obterExtensao(n2);

    if (!extensoesCompativeis(ext1, ext2)) {
      return false;
    }
    
    // Comparação exata normalizada
    if (n1 === n2) return true;
    
    // Comparação sem extensão
    const n1SemExt = n1.substring(0, n1.lastIndexOf('.'));
    const n2SemExt = n2.substring(0, n2.lastIndexOf('.'));
    if (n1SemExt === n2SemExt) return true;
    
    // Comparação parcial (um contém o outro)
    if (n1SemExt.includes(n2SemExt) || n2SemExt.includes(n1SemExt)) {
      // Verificar se a diferença é apenas espaços/underscores
      const n1Limpo = n1SemExt.replace(/\s|_/g, '');
      const n2Limpo = n2SemExt.replace(/\s|_/g, '');
      if (n1Limpo === n2Limpo) return true;
    }
    
    return false;
  };
  
  const filenameNormalizado = normalizarNome(filename);
  
  console.log(`🔍 Iniciando busca flexível para: ${filename}`);
  console.log(`📝 Nome normalizado: ${filenameNormalizado}`);
  
  // Buscar arquivo com nome similar (case-insensitive e ignorando timestamp)
  for (const pasta of Array.from(pastasUnicas)) {
    try {
      const arquivos = readdirSync(pasta);
      console.log(`📁 Verificando pasta: ${pasta} (${arquivos.length} arquivos)`);
      const arquivoEncontrado = arquivos.find((arquivo: string) => {
        const arquivoLower = arquivo.toLowerCase();
        const filenameLower = filename.toLowerCase();
        const extArquivoOriginal = obterExtensao(arquivo);
        const extProcuradoOriginal = obterExtensao(filename);
        const extensaoValida = extensoesCompativeis(extArquivoOriginal, extProcuradoOriginal);
        
        // Busca exata
        if (arquivoLower === filenameLower || arquivo === filename) {
          return true;
        }
        
        // Busca normalizada (ignora timestamp e diferenças de formatação)
        if (compararNomes(arquivo, filename)) {
          return true;
        }

        if (!extensaoValida) {
          return false;
        }
        
        // Busca parcial (sem timestamp) - mais flexível
        // REMOVER TIMESTAMP DO NOME PROCURADO
        const nomeSemTimestamp = filename.replace(/^\d+-/, '').toLowerCase().trim();
        const arquivoSemExt = arquivo.includes('.') 
          ? arquivo.substring(0, arquivo.lastIndexOf('.')).toLowerCase().trim()
          : arquivo.toLowerCase().trim();
        
        console.log(`   🔍 Comparando: "${nomeSemTimestamp}" com "${arquivoSemExt}"`);
        
        // Remover espaços, underscores e caracteres especiais para comparação
        const nomeLimpo = nomeSemTimestamp.replace(/\s|_/g, '').replace(/[^a-z0-9]/g, '');
        const arquivoLimpo = arquivoSemExt.replace(/\s|_/g, '').replace(/[^a-z0-9]/g, '');
        
        console.log(`   🧹 Limpos: "${nomeLimpo}" vs "${arquivoLimpo}"`);
        
        // Comparação exata após limpeza
        if (nomeLimpo === arquivoLimpo) {
          console.log(`   ✅ MATCH! Comparação exata após limpeza`);
          return true;
        }
        
        // Comparação parcial (um contém o outro)
        if (nomeLimpo.length > 3 && arquivoLimpo.length > 3) {
          if (arquivoLimpo.includes(nomeLimpo) || nomeLimpo.includes(arquivoLimpo)) {
            console.log(`   ✅ MATCH! Comparação parcial`);
            return true;
          }
        }
        
        // Comparação por palavras (split por espaços/underscores)
        const nomePalavras = nomeSemTimestamp.split(/[\s_]+/).filter(w => w.length > 2);
        const arquivoPalavras = arquivoSemExt.split(/[\s_]+/).filter(w => w.length > 2);
        
        console.log(`   📝 Palavras: [${nomePalavras.join(', ')}] vs [${arquivoPalavras.join(', ')}]`);
        
        if (nomePalavras.length > 0 && arquivoPalavras.length > 0) {
          // Verificar se todas as palavras do nome estão no arquivo (ou vice-versa)
          const todasPalavrasEncontradas = nomePalavras.every(palavra => 
            arquivoPalavras.some(ap => ap.includes(palavra) || palavra.includes(ap))
          );
          if (todasPalavrasEncontradas && nomePalavras.length === arquivoPalavras.length) {
            console.log(`   ✅ MATCH! Todas as palavras encontradas`);
            return true;
          }
        }
        
        return false;
      });
      
      if (arquivoEncontrado) {
        const caminhoEncontrado = join(pasta, arquivoEncontrado);
        caminhosVerificados.push(caminhoEncontrado);
        console.log(`✅ Arquivo encontrado (busca flexível): ${caminhoEncontrado}`);
        console.log(`   Procurado: ${filename}`);
        console.log(`   Encontrado: ${arquivoEncontrado}`);
        return { path: caminhoEncontrado, searchedPaths: caminhosVerificados };
      }
    } catch (err) {
      // Ignorar erros ao ler pasta
    }
  }
  
  return { path: null, searchedPaths: caminhosVerificados };
}

