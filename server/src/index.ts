import express from "express";
import helmet from "helmet";
import expressMongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { log } from "./utils/logger";

const app = express();

app.use(cors());
app.use(helmet());
app.use(expressMongoSanitize());
app.use(cookieParser());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

app.listen(3000, () => {
  log.info("Server is running on port 3000");
});
