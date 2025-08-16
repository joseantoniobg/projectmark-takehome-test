import { Topic } from "../entities/topic";
import { TopicRepository } from "../repositories/topic.repository";
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  ValidationError,
} from "./error-handling/mapped-errors";

export class GetTopicUseCase {
  constructor(private readonly topicRepository: TopicRepository) {}

  async execute(id: string, version?: number): Promise<Topic> {
    let topic: Topic | null;

    if (!id) {
      throw new ValidationError("Id must be informed");
    }

    try {
      topic = await this.topicRepository.get(id);
    } catch (e: any) {
      throw new InternalServerError();
    }

    if (!topic) {
      throw new NotFoundError("Topic not found");
    }

    let currentVersion;

    try {
      currentVersion = await this.topicRepository.getLastVersionByStack(
        topic.stack
      );
    } catch (e) {
      throw new InternalServerError();
    }

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
