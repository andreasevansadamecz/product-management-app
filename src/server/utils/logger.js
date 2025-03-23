// server/utils/logger.js
import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";

// Create logs directory if it doesn't exist
const logsDir = path.join("server", "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  defaultMeta: { service: "product-api" },
  transports: [
    new transports.File({ filename: path.join(logsDir, "error.log"), level: "error" }),
    new transports.File({ filename: path.join(logsDir, "combined.log") })
  ]
});

export default logger;
