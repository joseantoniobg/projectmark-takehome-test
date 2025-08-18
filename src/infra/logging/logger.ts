import winston, { format } from "winston";
import { ILogger } from "../../domain/logging/logger";

export class WinstonLogger implements ILogger {
  private logger = winston.createLogger({
    level: "info",
    format: format.combine(format.timestamp(), format.json()),
    transports: [new winston.transports.Console()],
  });

  info(message: string, ...meta: any[]) {
    this.logger.info(message, ...meta);
  }
  error(message: string, ...meta: any[]) {
    this.logger.error(message, ...meta);
  }
  exception(useCase: string, err: unknown): void {
    if (err instanceof Error) {
      this.logger.error("Exception", {
        date: new Date(),
        usecase: useCase,
        message: err?.message,
        stack: err?.stack,
      });
      return;
    }

    this.logger.error("Unknown Exception", { value: String(err) });
  }
}
