const { Client } = require("pg");
const { DATABASE_URL, PG_SSL } = require("../config");
const { readDb } = require("../data/store");

function quoteIdentifier(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

async function ensureDatabaseExists() {
  const targetUrl = new URL(DATABASE_URL);
  const databaseName = targetUrl.pathname.replace(/^\//, "");

  if (!databaseName) {
    throw new Error("DATABASE_URL must include a database name.");
  }

  const maintenanceUrl = new URL(DATABASE_URL);
  maintenanceUrl.pathname = "/postgres";

  const client = new Client({
    connectionString: maintenanceUrl.toString(),
    ssl: PG_SSL ? { rejectUnauthorized: false } : false
  });
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
  console.error("Failed to initialize PostgreSQL:", error.message);
  process.exit(1);
});
