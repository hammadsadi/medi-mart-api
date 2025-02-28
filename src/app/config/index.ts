import dotenv from "dotenv";
import path from "path";
// Dotenv Config
dotenv.config({ path: path.join((process.cwd(), ".env")) });

// Export
export default {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
};