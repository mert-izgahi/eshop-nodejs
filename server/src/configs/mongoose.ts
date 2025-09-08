import mongoose from "mongoose";
import { log } from "../utils/logger";
export const connectDb = async (connectionString: string) => {
  try {
    const connection = await mongoose.connect(connectionString);
    log.info(`Connected to MongoDB: ${connection.connection.host}`);
  } catch (error: any) {
    log.error("Error connecting to MongoDB:", error);
  }
};
