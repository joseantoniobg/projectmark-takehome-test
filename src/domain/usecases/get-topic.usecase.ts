import { Topic } from "../entities/topic";
import { TopicRepository } from "../repositories/topic.repository";
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
} from "./error-handling/app-error";

export class GetTopicUseCase {
  constructor(private readonly topicRepository: TopicRepository) {}

  async execute(id: string, version?: number): Promise<Topic> {
    let topic: Topic | null;

    try {
      topic = await this.topicRepository.get(id);
    } catch (e) {
      throw new InternalServerError();
    }

    if (!topic) {
      throw new NotFoundError("Topic not found");
    }

    const currentVersion = await this.topicRepository.getLastVersionByStack(
      topic?.stack
    );

    if (currentVersion > topic.version) {
      throw new ConflictError("Outdated topic");
    }

    if (!version) {
      return topic;
    }

    topic = await this.topicRepository.getOneByVersion(
      topic.stack,
      topic.version
    );

    if (!topic) {
      throw new NotFoundError("Topic not found");
    }

    return topic;
  }
}
