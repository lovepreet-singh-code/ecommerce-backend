import dotenv from "dotenv";
import path from "path";

// Load .env from root folder (if services have their own .env, it will pick that)
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const config = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5001,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/user-service",
  jwtSecret: process.env.JWT_SECRET || "supersecret",
  logLevel: process.env.LOG_LEVEL || "info",
};
