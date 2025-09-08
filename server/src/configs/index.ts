import dotenv from "dotenv";
import path from "path";
import { type CorsOptions } from "cors";
const config = dotenv.config({
  path: path.join(__dirname, "..", "..", ".env"),
});

if (config.error) {
  throw new Error("Failed to load environment variables");
}

export const PORT = process.env.PORT || 5001;
export const NODE_ENV = process.env.NODE_ENV || "development";

// CORS Configuration
// Configuration for Cross-Origin Resource Sharing (CORS)
export const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:8080",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:8080",
      "http://127.0.0.1:5001",
      process.env.FRONTEND_URL,
      process.env.SWAGGER_URL,
    ];

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // For development, allow all origins
    if (process.env.NODE_ENV === "development") {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cache-Control",
    "Pragma",
  ],
  exposedHeaders: ["set-cookie"],
};

// Helmet configuration
// Helmet configuration is used for security
export const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      fontSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "ws:", "wss:"],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      reportUri: "/api/v1/security/csp-report",
    },
  },
  crossOriginEmbedderPolicy: false,
};
