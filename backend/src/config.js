const PORT = Number(process.env.PORT) || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "change_this_in_production";
const TOKEN_EXPIRY = "7d";

module.exports = {
  PORT,
  JWT_SECRET,
  TOKEN_EXPIRY
};
