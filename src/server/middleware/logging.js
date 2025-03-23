// server/middleware/logging.js
import logger from "../utils/logger.js";

export function logRequest(req, res, next) {
  const method = req.method;
  const path = req.originalUrl;
  const time = new Date().toISOString();

  logger.info(`${method} ${path} @ ${time}`);
  next();
}
