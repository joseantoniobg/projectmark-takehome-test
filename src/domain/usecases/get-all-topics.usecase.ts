import { Topic } from "../entities/topic";
import { ILogger } from "../logging/logger";
import { ITopicRepository } from "../repositories/topic.repository";
import { UseCase } from "./abstract/use-case";

export class GetAllTopicsUseCase extends UseCase<void, Topic[]> {
  constructor(
    private readonly topicRepository: ITopicRepository,
    logger: ILogger
  ) {
    super("GetAllTopics", logger);
  }

  async perform(): Promise<Topic[]> {
    return this.topicRepository.getAll();
  }
}
