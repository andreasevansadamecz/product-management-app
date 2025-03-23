// server/middleware/errorHandler.js
import logger from "../utils/logger.js";

export function errorHandler(err, req, res, next) {
  logger.error(`${req.method} ${req.originalUrl} ❌ ${err.message}`);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({ error: message });
}
