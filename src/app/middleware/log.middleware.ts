import { Request, Response, NextFunction } from "express";
import logger from "../../infra/logging";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    const logMeta: Record<string, any> = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      body: Object.keys(req.body || {}).length > 0 && req.body,
      params: Object.keys(req.params || {}).length > 0 && req.params,
      query: Object.keys(req.query || {}).length > 0 && req.query,
      duration,
      ip: req.ip,
      userAgent: req.get("user-agent") || "",
    };

    if (res.statusCode >= 500) {
      logger.error("request failed", logMeta);
    } else if (res.statusCode >= 400) {
      logger.error("client error", logMeta);
    } else {
      logger.info("request", logMeta);
    }
  });

  next();
}
