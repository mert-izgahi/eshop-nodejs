import dotenv from "dotenv";
import path from "path";

const config = dotenv.config({
  path: path.join(__dirname, "..", "..", ".env"),
});

if (config.error) {
  throw new Error("Failed to load environment variables");
}

export const PORT = process.env.PORT || 5001;
export const NODE_ENV = process.env.NODE_ENV || "development";
