import winston from "winston";
import { Logger } from "../../domain/logging/logger";

export class WinstonLogger implements Logger {
  private logger = winston.createLogger({
    level: "info",
    transports: [new winston.transports.Console()],
  });

  info(message: string, ...meta: any[]) {
    this.logger.info(message, ...meta);
  }
  error(message: string, ...meta: any[]) {
    this.logger.error(message, ...meta);
  }
}
