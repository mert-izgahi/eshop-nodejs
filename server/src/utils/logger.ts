import pino from "pino";
import dayjs from "dayjs";
import fs from "fs";
import path from "path";

const loggingDirectory = path.join(__dirname, "..", "..", "logs");
if (!fs.existsSync(loggingDirectory)) {
  fs.mkdirSync(loggingDirectory);
}

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: {
    targets: [
      {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:HH:MM:ss.l",
          ignore: "pid,hostname",
        },
      },
      {
        target: "pino/file",
        options: {
          destination: path.join(loggingDirectory, "app.log"),
        },
      },
    ],
  },
  base: {
    pid: process.pid,
    hostname: process.env.HOSTNAME || "localhost",
  },
  timestamp: () => `,"time":"${dayjs().format("YYYY-MM-DD HH:mm:ss")}"`,
});

export const log = logger;
