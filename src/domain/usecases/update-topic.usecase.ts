import { Topic } from "../entities/topic";
import { RoleEnum } from "../enums/role.enum";
import { TopicModel } from "../models/topic.model";
import { TopicRepository } from "../repositories/topic.repository";
import { UserRepository } from "../repositories/user.repository";
import { CreateTopicUseCase } from "./create-topic.usecase";
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "./error-handling/app-error";

export class UpdateTopicUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly topicRepository: TopicRepository,
    private readonly createTopicUseCase: CreateTopicUseCase
  ) {}

  async execute(id: string, topic: TopicModel): Promise<Topic> {
    const originalTopic = await this.topicRepository.get(id);

    if (!originalTopic) {
      throw new NotFoundError("Topic not found");
    }

    const lastVersion = await this.topicRepository.getLastVersionByStack(
      originalTopic.stack
    );

    if (lastVersion > originalTopic.version) {
      throw new ConflictError("Cannot update an outdated topic");
    }

    const user = await this.userRepository.find(topic.userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (originalTopic?.userId !== user.id && user.role !== RoleEnum.ADMIN) {
      throw new UnauthorizedError(
        "Only admins or the topic's author can update the topic"
      );
    }

    const version = originalTopic.version + 1;

    try {
      return this.createTopicUseCase.execute(
        topic,
        originalTopic.id,
        user,
        version
      );
    } catch (e) {
      throw new InternalServerError();
    }
  }
}
