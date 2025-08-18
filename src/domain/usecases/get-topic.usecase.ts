import { Topic } from "../entities/topic";
import { ILogger } from "../logging/logger";
import { IGetTopicModel } from "../models/get-topic-model";
import { ITopicRepository } from "../repositories/topic.repository";
import { UseCase } from "./abstract/use-case";
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  ValidationError,
} from "./error-handling/mapped-errors";

export class GetTopicUseCase extends UseCase<IGetTopicModel, Topic> {
  constructor(
    private readonly topicRepository: ITopicRepository,
    logger: ILogger
  ) {
    super("GetTopic", logger);
  }

  async perform(input: IGetTopicModel): Promise<Topic> {
    const { id, version } = input;

    let topic: Topic | null;

    if (!id) {
      throw new ValidationError("Id must be informed");
    }

    topic = await this.topicRepository.get(id);

    if (!topic) {
      throw new NotFoundError("Topic not found");
    }

    let currentVersion;

    currentVersion = await this.topicRepository.getLastVersionByStack(
      topic.stack
    );

    if (currentVersion > topic.version) {
      throw new ConflictError("Outdated topic");
    }

    if (!version) {
      return topic;
    }

    try {
      topic = await this.topicRepository.getOneByVersion(topic.stack, version);
    } catch (e) {
      throw new InternalServerError();
    }

    if (!topic) {
      throw new NotFoundError("Topic not found");
    }

    return topic;
  }
}
