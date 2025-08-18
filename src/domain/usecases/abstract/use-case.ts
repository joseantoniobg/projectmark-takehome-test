import { ILogger } from "../../logging/logger";
import {
  InternalServerError,
  MappedError,
} from "../error-handling/mapped-errors";

export abstract class UseCase<TInput, TOutput> {
  protected logger: ILogger;

  constructor(private readonly useCase: string, logger: ILogger) {
    this.logger = logger;
  }

  protected abstract perform(input: TInput): Promise<TOutput>;

  async execute(input: TInput): Promise<TOutput> {
    try {
      return await this.perform(input);
    } catch (err: unknown) {
      if (err instanceof MappedError) {
        throw err;
      }

      this.logger.exception(this.useCase, err);
      throw new InternalServerError();
    }
  }
}
