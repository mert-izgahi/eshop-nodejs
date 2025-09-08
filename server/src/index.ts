import express from "express";
import helmet from "helmet";
import expressMongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";

// Configs
import { log } from "./utils/logger";
import { corsOptions, helmetOptions, PORT } from "./configs";
import swaggerSpec from "./configs/swagger";
// Middlewares
import { errorHandlerMiddleware } from "./middlewares/error-handler.middleware";

// Routes
import { healthRouter } from "./routes/health.routes";

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
app.use("/api/v1", healthRouter);

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  log.info(`Server is running on port ${PORT}`);
});
