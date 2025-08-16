import { Topic } from "../entities/topic";
import { RoleEnum } from "../enums/role.enum";
import { PermissionStrategyFactory } from "../factories/permission-strategy.factory";
import { UpdateTopicModel } from "../models/update-topic.model";
import { TopicRepository } from "../repositories/topic.repository";
import { UserRepository } from "../repositories/user.repository";
import { CreateTopicUseCase } from "./create-topic.usecase";
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "./error-handling/mapped-errors";
import { GetTopicUseCase } from "./get-topic.usecase";

export class UpdateTopicUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly topicRepository: TopicRepository,
    private readonly createTopicUseCase: CreateTopicUseCase,
    private readonly getTopicUseCase: GetTopicUseCase
  ) {}

  async execute(id: string, topic: UpdateTopicModel): Promise<Topic> {
    const user = await this.userRepository.find(topic.userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const userPermissions = PermissionStrategyFactory.create(user.role);

    if (!userPermissions.canEditOwnTopic()) {
      throw new UnauthorizedError("User can't edit topics");
    }

    const originalTopic = await this.getTopicUseCase.execute(id);

    if (
      originalTopic.userId !== user.id &&
      !userPermissions.canEditAnyTopic()
    ) {
      throw new UnauthorizedError("User can't edit this topic");
    }

    return this.topicRepository.transaction(async (repository) => {
      const newTopic = await this.createTopicUseCase.execute(
        { ...topic, parentTopicId: originalTopic.parentTopicId },
        originalTopic.id,
        user,
        originalTopic.version,
        repository
      );

      const children = await repository.getChildren(originalTopic.id);
      await repository.updateTopicHierarchyReference(newTopic.id, children);
      return newTopic;
    });
  }
}
