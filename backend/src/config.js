const fs = require("fs");
const path = require("path");

const ENV_PATH = path.join(__dirname, "../.env");
const DEFAULT_DATABASE_URL = "postgres://postgres:postgres@localhost:5432/datamak_ecommerce";
const DEFAULT_JWT_SECRET = "change_this_in_production";
const LOCAL_DATABASE_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const DATABASE_URL_PLACEHOLDERS = [
  "YOUR_PASSWORD",
  "USER:PASSWORD",
  "HOST-pooler",
  "REGION",
  "/DB?"
];

function loadEnvFile() {
  if (!fs.existsSync(ENV_PATH)) {
    return false;
  }

  const lines = fs.readFileSync(ENV_PATH, "utf-8").split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });

  return true;
}

const envFileLoaded = loadEnvFile();

function parseBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

function parseDatabaseUrl(databaseUrl) {
  try {
    return new URL(databaseUrl);
  } catch (error) {
    return null;
  }
}

function shouldUseDatabaseSsl(databaseUrl) {
  const parsedUrl = parseDatabaseUrl(databaseUrl);
  if (!parsedUrl) {
    return false;
  }

  const sslMode = String(parsedUrl.searchParams.get("sslmode") || "").toLowerCase();
  if (["require", "verify-ca", "verify-full"].includes(sslMode)) {
    return true;
  }

  return parsedUrl.hostname.endsWith(".neon.tech");
}

function isLocalDatabaseUrl(databaseUrl) {
  const parsedUrl = parseDatabaseUrl(databaseUrl);
  return Boolean(parsedUrl && LOCAL_DATABASE_HOSTS.has(parsedUrl.hostname));
}

function parsePositiveInteger(value, fallback) {
  const parsed = Math.trunc(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function hasPlaceholderDatabaseUrl(databaseUrl) {
  return DATABASE_URL_PLACEHOLDERS.some((placeholder) => databaseUrl.includes(placeholder));
}

const PORT = Number(process.env.PORT) || 4000;
const JWT_SECRET = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
const TOKEN_EXPIRY = "7d";
const RAW_DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL_NO_SSL ||
  "";
const DATABASE_URL =
  RAW_DATABASE_URL ||
  DEFAULT_DATABASE_URL;
const PG_SSL =
  process.env.PG_SSL === undefined
    ? shouldUseDatabaseSsl(DATABASE_URL)
    : parseBoolean(process.env.PG_SSL);
const PG_POOL_MAX = parsePositiveInteger(
  process.env.PG_POOL_MAX,
  process.env.VERCEL ? 1 : 10
);
const DB_CREATE_DATABASE =
  process.env.DB_CREATE_DATABASE === undefined
    ? isLocalDatabaseUrl(DATABASE_URL)
    : parseBoolean(process.env.DB_CREATE_DATABASE);
const LOCAL_UPLOADS_ENABLED = parseBoolean(process.env.ENABLE_LOCAL_UPLOADS, !process.env.VERCEL);

function getPgSslConfig() {
  return PG_SSL ? { rejectUnauthorized: false } : false;
}

function getPgPoolConfig() {
  return {
    connectionString: DATABASE_URL,
    ssl: getPgSslConfig(),
    max: PG_POOL_MAX,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
  };
}

function getPgClientConfig(connectionString = DATABASE_URL) {
  return {
    connectionString,
    ssl: getPgSslConfig(),
    connectionTimeoutMillis: 10000
  };
}

function getDatabaseSetupHint() {
  const hints = [];

  if (!RAW_DATABASE_URL) {
    if (!envFileLoaded) {
      hints.push("Create backend/.env by copying backend/.env.example.");
    }
    hints.push(
      "Set DATABASE_URL or POSTGRES_URL with your real PostgreSQL connection string."
    );
  }

  if (hasPlaceholderDatabaseUrl(DATABASE_URL)) {
    hints.push("Replace all placeholder values in DATABASE_URL.");
  }

  if (parseDatabaseUrl(DATABASE_URL) === null) {
    hints.push("Check that DATABASE_URL is a valid PostgreSQL connection string.");
  }

  return hints.join(" ");
}

function getRuntimeConfigErrors() {
  const errors = [];

  if (process.env.NODE_ENV === "production" && !RAW_DATABASE_URL) {
    errors.push("Set DATABASE_URL or POSTGRES_URL before deploying to production.");
  }

  if (process.env.NODE_ENV === "production" && isLocalDatabaseUrl(DATABASE_URL)) {
    errors.push("Production DATABASE_URL cannot point to localhost.");
  }

  if (hasPlaceholderDatabaseUrl(DATABASE_URL)) {
    errors.push("DATABASE_URL still contains placeholder values.");
  }

  if (process.env.NODE_ENV === "production" && JWT_SECRET === DEFAULT_JWT_SECRET) {
    errors.push("Set JWT_SECRET to a long random value before deploying to production.");
  }

  if (parseDatabaseUrl(DATABASE_URL) === null) {
    errors.push("DATABASE_URL is not a valid PostgreSQL connection string.");
  }

  return errors;
}

function assertRuntimeConfig() {
  const errors = getRuntimeConfigErrors();
  if (errors.length) {
    throw new Error(errors.join(" "));
  }
}

module.exports = {
  PORT,
  JWT_SECRET,
  TOKEN_EXPIRY,
  DATABASE_URL,
  PG_SSL,
  PG_POOL_MAX,
  DB_CREATE_DATABASE,
  LOCAL_UPLOADS_ENABLED,
  getPgPoolConfig,
  getPgClientConfig,
  getDatabaseSetupHint,
  getRuntimeConfigErrors,
  assertRuntimeConfig
};
