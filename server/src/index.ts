import express, { type Request, type Response } from "express";
import helmet from "helmet";
import expressMongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
// Configs
import { log } from "./utils/logger";
import { corsOptions, helmetOptions, PORT, MONGODB_URI } from "./configs";
import { connectDb } from "./configs/mongoose";
// Middlewares
import { errorHandlerMiddleware } from "./middlewares/error-handler.middleware";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import { loggerMiddleware } from "./middlewares/logger.middleware";
// Routes
import { systemRouter } from "./routers/system.routes";
import { authRouter } from "./routers/auth.routers";
import { categoryRouter } from "./routers/category.routers";

// Services
import redisService from "./services/redis";
const app = express();

app.use(cors(corsOptions));
app.use(helmet(helmetOptions));
app.use(expressMongoSanitize());
app.use(cookieParser());
app.use(loggerMiddleware);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

// API Endpoints
app.use("/api/v1", systemRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/categories", categoryRouter);

// Error handlers
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.listen(PORT, async () => {
  await connectDb(MONGODB_URI);
  try {
    await redisService.connect();
  } catch (error: any) {
    log.error("Failed to connect to Redis:", error);
  }
  log.info(`Server is running on port ${PORT}`);
  log.info(`Swagger UI is available at http://localhost:${PORT}/api-docs`);
});
