import { readFileSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { MongoClient } from "mongodb";

const DEBUG = process.argv.includes("--debug");

function logDebug(...args) {
  if (DEBUG) {
    console.log(...args);
  }
}

function carregarEnv() {
  const envPath = join(process.cwd(), ".env.local");
  const envVars = {};

  try {
    const envContent = readFileSync(envPath, "utf-8");
    envContent.split("\n").forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const [key, ...valueParts] = trimmed.split("=");
        const value = valueParts.join("=").trim();
        envVars[key.trim()] = value;
      }
    });
  } catch (err) {
    console.log("⚠️ Não foi possível ler .env.local");
  }

  return envVars;
}

function getPossibleFilePaths(filename, uploadsPathFromEnv) {
  const caminhos = [];

  caminhos.push(join(process.cwd(), "public", "uploads", filename));

  if (uploadsPathFromEnv) {
    caminhos.push(join(uploadsPathFromEnv, filename));
    caminhos.push(join(uploadsPathFromEnv, "uploads", filename));
    caminhos.push(join(uploadsPathFromEnv, "videos", filename));
  }

  const possiveisNomes = [
    "Dados Segurança",
    "Dados Seguranca",
    "DadosSegurança",
    "DadosSeguranca",
    "Dados de Segurança",
    "Dados de Seguranca",
  ];

  possiveisNomes.forEach(nome => {
    const caminhoBase = join("C:", nome);
    caminhos.push(join(caminhoBase, filename));
    caminhos.push(join(caminhoBase, "uploads", filename));
    caminhos.push(join(caminhoBase, "videos", filename));
    caminhos.push(join(caminhoBase, "arquivos", filename));
  });

  caminhos.push(join("C:", "Videos", filename));
  caminhos.push(join("C:", "Documents", "Dados Segurança", filename));
  caminhos.push(join(process.env.USERPROFILE || "", "Documents", "Dados Segurança", filename));
  caminhos.push(join(process.env.USERPROFILE || "", "Videos", filename));

  return caminhos;
}

function normalizarNome(nome) {
  let nomeNormalizado = nome.replace(/^\d+-/, "");

  const lastDot = nomeNormalizado.lastIndexOf(".");
  if (lastDot === -1) {
    return nomeNormalizado.toLowerCase().trim();
  }

  const ext = nomeNormalizado.substring(lastDot);
  nomeNormalizado = nomeNormalizado.substring(0, lastDot);
  nomeNormalizado = nomeNormalizado
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  return nomeNormalizado + ext.toLowerCase();
}

function compararNomes(nome1, nome2) {
  const n1 = normalizarNome(nome1);
  const n2 = normalizarNome(nome2);

  if (n1 === n2) return true;

  const lastDot1 = n1.lastIndexOf(".");
  const lastDot2 = n2.lastIndexOf(".");
  const n1SemExt = lastDot1 === -1 ? n1 : n1.substring(0, lastDot1);
  const n2SemExt = lastDot2 === -1 ? n2 : n2.substring(0, lastDot2);

  if (n1SemExt === n2SemExt) return true;

  if (n1SemExt.includes(n2SemExt) || n2SemExt.includes(n1SemExt)) {
    const n1Limpo = n1SemExt.replace(/\s|_/g, "");
    const n2Limpo = n2SemExt.replace(/\s|_/g, "");
    if (n1Limpo === n2Limpo) return true;
  }

  const nomeSemTimestamp = nome1.replace(/^\d+-/, "").toLowerCase().trim();
  const arquivoSemExt = nome2.includes(".")
    ? nome2.substring(0, nome2.lastIndexOf(".")).toLowerCase().trim()
    : nome2.toLowerCase().trim();

  const nomeLimpo = nomeSemTimestamp.replace(/\s|_/g, "").replace(/[^a-z0-9]/g, "");
  const arquivoLimpo = arquivoSemExt.replace(/\s|_/g, "").replace(/[^a-z0-9]/g, "");

  if (nomeLimpo === arquivoLimpo) return true;

  if (nomeLimpo.length > 3 && arquivoLimpo.length > 3) {
    if (arquivoLimpo.includes(nomeLimpo) || nomeLimpo.includes(arquivoLimpo)) {
      return true;
    }
  }

  const nomePalavras = nomeSemTimestamp.split(/[\s_]+/).filter(w => w.length > 2);
  const arquivoPalavras = arquivoSemExt.split(/[\s_]+/).filter(w => w.length > 2);

  if (nomePalavras.length > 0 && arquivoPalavras.length > 0) {
    const todasPalavrasEncontradas = nomePalavras.every(palavra =>
      arquivoPalavras.some(ap => ap.includes(palavra) || palavra.includes(ap))
    );
    if (todasPalavrasEncontradas && nomePalavras.length === arquivoPalavras.length) {
      return true;
    }
  }

  return false;
}

function findFileFlexible(filename, uploadsPathFromEnv) {
  const caminhos = getPossibleFilePaths(filename, uploadsPathFromEnv);
  const caminhosVerificados = [];

  for (const caminho of caminhos) {
    caminhosVerificados.push(caminho);
    if (existsSync(caminho)) {
      return { encontrado: true, caminho, nomesVerificados: caminhosVerificados, nomeCorrespondente: filename };
    }
  }

  const pastasUnicas = new Set();
  caminhos.forEach(caminho => {
    const pasta = dirname(caminho);
    if (existsSync(pasta)) {
      pastasUnicas.add(pasta);
    }
  });

  [
    "C:\\Dados Segurança",
    "C:\\Dados Seguranca",
    join(process.cwd(), "public", "uploads"),
    uploadsPathFromEnv || null,
  ].forEach(pasta => {
    if (pasta && existsSync(pasta)) {
      pastasUnicas.add(pasta);
    }
  });

  for (const pasta of pastasUnicas) {
    try {
      const arquivos = readdirSync(pasta);
      for (const arquivo of arquivos) {
        if (compararNomes(filename, arquivo)) {
          const caminhoEncontrado = join(pasta, arquivo);
          caminhosVerificados.push(caminhoEncontrado);
          return {
            encontrado: true,
            caminho: caminhoEncontrado,
            nomesVerificados: caminhosVerificados,
            nomeCorrespondente: arquivo,
          };
        }
      }
    } catch (err) {
      logDebug(`⚠️ Não foi possível ler a pasta ${pasta}: ${err.message}`);
    }
  }

  return { encontrado: false, caminho: null, nomesVerificados: caminhosVerificados };
}

async function gerarRelatorio() {
  const envVars = carregarEnv();
  const mongoUri = envVars.MONGODB_URI;
  const uploadsPathFromEnv = envVars.UPLOADS_PATH || envVars.UPLOADS_DIR || "";

  if (!mongoUri) {
    console.error("❌ MONGODB_URI não encontrado no .env.local");
    process.exit(1);
  }

  const client = new MongoClient(mongoUri);

  console.log("========================================");
  console.log("  Relatório de Arquivos por Cliente");
  console.log("========================================\n");

  try {
    await client.connect();
    console.log("✅ Conectado ao MongoDB\n");

    const db = client.db();
    const possibleCollections = ["sistema_clientes", "clientes", "Cliente", "Clientes", "cliente"];
    let collection = null;
    let collectionName = null;

    for (const colName of possibleCollections) {
      try {
        const col = db.collection(colName);
        const count = await col.countDocuments();
        if (count > 0) {
          collection = col;
          collectionName = colName;
          break;
        }
      } catch (err) {
        // Ignorar e tentar próxima
      }
    }

    if (!collection) {
      console.error("❌ Nenhuma coleção de clientes encontrada no banco");
      return;
    }

    console.log(`📁 Coleção utilizada: ${collectionName}`);

    const filtro = { anexos: { $exists: true, $ne: [] } };
    const clientes = await collection.find(filtro).sort({ nome: 1 }).toArray();

    console.log(`📊 Clientes com anexos: ${clientes.length}\n`);

    let totalAnexos = 0;
    let totalArquivosEncontrados = 0;
    let totalArquivosFaltando = 0;

    const relatorio = [];

    for (const cliente of clientes) {
      const anexos = Array.isArray(cliente.anexos) ? cliente.anexos : [];
      if (anexos.length === 0) continue;

      const infoCliente = {
        id: cliente._id ? cliente._id.toString() : "",
        nome: cliente.nome || "(sem nome)",
        totalAnexos: 0,
        locais: [],
        encontrados: [],
        faltando: [],
      };

      for (const anexo of anexos) {
        if (!anexo || !anexo.url) continue;

        const isRemoto = /^https?:\/\//i.test(anexo.url);
        const nomeAnexo = anexo.nome || anexo.url;

        if (isRemoto) {
          infoCliente.locais.push({
            nome: nomeAnexo,
            url: anexo.url,
            status: "remoto",
          });
          continue;
        }

        const urlParts = anexo.url.split("/");
        const fileName = decodeURIComponent(urlParts[urlParts.length - 1] || "");

        if (!fileName) {
          infoCliente.faltando.push({
            nome: nomeAnexo,
            url: anexo.url,
            motivo: "Nome de arquivo inválido",
          });
          continue;
        }

        infoCliente.totalAnexos += 1;
        totalAnexos += 1;

        const resultadoBusca = findFileFlexible(fileName, uploadsPathFromEnv);

        if (resultadoBusca.encontrado) {
          totalArquivosEncontrados += 1;
          infoCliente.encontrados.push({
            nome: nomeAnexo,
            arquivoReferenciado: fileName,
            arquivoEncontrado: resultadoBusca.nomeCorrespondente,
            caminho: resultadoBusca.caminho,
          });
        } else {
          totalArquivosFaltando += 1;
          infoCliente.faltando.push({
            nome: nomeAnexo,
            arquivoReferenciado: fileName,
            url: anexo.url,
          });
        }
      }

      if (infoCliente.totalAnexos > 0 || infoCliente.faltando.length > 0 || infoCliente.locais.length > 0) {
        relatorio.push(infoCliente);
      }
    }

    console.log("========================================");
    console.log("Resumo Geral");
    console.log("========================================");
    console.log(`📄 Total de clientes analisados: ${relatorio.length}`);
    console.log(`📎 Total de anexos locais referenciados: ${totalAnexos}`);
    console.log(`✅ Arquivos encontrados: ${totalArquivosEncontrados}`);
    console.log(`❌ Arquivos faltando: ${totalArquivosFaltando}`);
    console.log();

    const clientesComProblemas = relatorio.filter(c => c.faltando.length > 0);

    if (clientesComProblemas.length === 0) {
      console.log("🎉 Todos os anexos locais foram encontrados!");
    } else {
      console.log("❗ Clientes com anexos faltando:");
      clientesComProblemas.forEach((cliente, index) => {
        console.log(`\n${index + 1}. ${cliente.nome}`);
        cliente.faltando.forEach(faltando => {
          console.log(`   - Anexo: ${faltando.nome}`);
          console.log(`     Arquivo esperado: ${faltando.arquivoReferenciado || "(não definido)"}`);
          if (faltando.url) {
            console.log(`     URL original: ${faltando.url}`);
          }
        });
      });
    }

    if (DEBUG) {
      console.log("\n========================================");
      console.log("Detalhes completos");
      console.log("========================================");
      relatorio.forEach(cliente => {
        console.log(`\n👤 ${cliente.nome}`);
        if (cliente.encontrados.length > 0) {
          console.log("   ✅ Encontrados:");
          cliente.encontrados.forEach(item => {
            console.log(`      - ${item.nome} => ${item.arquivoEncontrado}`);
            console.log(`        Caminho: ${item.caminho}`);
          });
        }
        if (cliente.faltando.length > 0) {
          console.log("   ❌ Faltando:");
          cliente.faltando.forEach(item => {
            console.log(`      - ${item.nome}`);
            console.log(`        Esperado: ${item.arquivoReferenciado}`);
          });
        }
        if (cliente.locais.length > 0) {
          console.log("   🌐 Anexos remotos (não verificados):");
          cliente.locais.forEach(item => {
            console.log(`      - ${item.nome} => ${item.url}`);
          });
        }
      });
    }

  } catch (error) {
    console.error("❌ Erro ao gerar relatório:", error);
  } finally {
    await client.close();
  }
}

gerarRelatorio();
