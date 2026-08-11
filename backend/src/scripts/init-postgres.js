const { Client } = require("pg");
const {
  DATABASE_URL,
  DB_CREATE_DATABASE,
  getPgClientConfig,
  getDatabaseSetupHint
} = require("../config");
const { readDb } = require("../data/store");

function quoteIdentifier(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

async function ensureDatabaseExists() {
  if (!DB_CREATE_DATABASE) {
    console.log("Skipping database creation because DATABASE_URL points to a managed database.");
    return;
  }

  const targetUrl = new URL(DATABASE_URL);
  const databaseName = targetUrl.pathname.replace(/^\//, "");

  if (!databaseName) {
    throw new Error("DATABASE_URL must include a database name.");
  }

  const maintenanceUrl = new URL(DATABASE_URL);
  maintenanceUrl.pathname = "/postgres";

  const client = new Client(getPgClientConfig(maintenanceUrl.toString()));
  await client.connect();

  try {
    const { rows } = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [
      databaseName
    ]);
    if (!rows.length) {
      await client.query(`CREATE DATABASE ${quoteIdentifier(databaseName)}`);
      console.log(`Created PostgreSQL database: ${databaseName}`);
    } else {
      console.log(`PostgreSQL database already exists: ${databaseName}`);
    }
  } finally {
    await client.end();
  }
}

async function main() {
  await ensureDatabaseExists();
  await readDb();
  console.log("PostgreSQL schema is ready and seed data has been imported.");
}

main().catch((error) => {
  const hint = getDatabaseSetupHint();
  const details = hint ? `${error.message} ${hint}` : error.message;
  console.error("Failed to initialize PostgreSQL:", details);
  process.exit(1);
});
