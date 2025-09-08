import express from "express";
import helmet from "helmet";
import expressMongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";

// Configs
import { log } from "./utils/logger";
import { corsOptions, helmetOptions, PORT, MONGODB_URI } from "./configs";
import swaggerSpec from "./configs/swagger";
import { connectDb } from "./configs/mongoose";
// Middlewares
import { errorHandlerMiddleware } from "./middlewares/error-handler.middleware";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
// Routes
import { systemRouter } from "./routers/system.routes";
import { authRouter } from "./routers/auth.routers";

const app = express();

app.use(cors(corsOptions));
app.use(helmet(helmetOptions));
app.use(expressMongoSanitize());
app.use(cookieParser());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1", systemRouter);
app.use("/api/v1", authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.listen(PORT, async () => {
  await connectDb(MONGODB_URI);
  log.info(`Server is running on port ${PORT}`);
  log.info(`Swagger UI is available at http://localhost:${PORT}/api-docs`);
});
