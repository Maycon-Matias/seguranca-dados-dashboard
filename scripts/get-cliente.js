import { readFileSync } from "fs";
import { join } from "path";
import { MongoClient } from "mongodb";

const envPath = join(process.cwd(), ".env.local");
const env = {};

try {
  const envContent = readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...valueParts] = trimmed.split("=");
      const value = valueParts.join("=").trim();
      env[key.trim()] = value;
    }
  });
} catch (err) {
  console.error("Não foi possível ler .env.local", err);
}

const uri = env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI não encontrado");
  process.exit(1);
}

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  const col = db.collection("sistema_clientes");

  const clientes = await col.find({ nome: { $regex: "maria", $options: "i" } }).toArray();
  console.log(`Encontrados ${clientes.length} clientes`);
  clientes.forEach(cliente => {
    console.log("====================");
    console.log("Nome:", cliente.nome);
    if (Array.isArray(cliente.anexos)) {
      cliente.anexos.forEach(anexo => {
        console.log(` - ${anexo.nome} => ${anexo.url}`);
      });
    }
  });

  await client.close();
}

run().catch(err => {
  console.error("Erro:", err);
});
