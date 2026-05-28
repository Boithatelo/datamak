const fs = require("fs");
const path = require("path");

const ENV_PATH = path.join(__dirname, "../.env");
const DEFAULT_DATABASE_URL = "postgres://postgres:postgres@localhost:5432/datamak_ecommerce";

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

const PORT = Number(process.env.PORT) || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "change_this_in_production";
const TOKEN_EXPIRY = "7d";
const DATABASE_URL =
  process.env.DATABASE_URL ||
  DEFAULT_DATABASE_URL;
const PG_SSL = process.env.PG_SSL === "true";

function getDatabaseSetupHint() {
  const hints = [];

  if (!process.env.DATABASE_URL) {
    if (!envFileLoaded) {
      hints.push("Create backend/.env by copying backend/.env.example.");
    }
    hints.push(
      "Set DATABASE_URL with your real PostgreSQL password, for example: postgres://postgres:<your_password>@localhost:5432/datamak_ecommerce"
    );
  }

  if (DATABASE_URL.includes("YOUR_PASSWORD")) {
    hints.push("Replace the literal YOUR_PASSWORD value in DATABASE_URL.");
  }

  return hints.join(" ");
}

module.exports = {
  PORT,
  JWT_SECRET,
  TOKEN_EXPIRY,
  DATABASE_URL,
  PG_SSL,
  getDatabaseSetupHint
};
