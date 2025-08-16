import { Topic } from "../entities/topic";
import { RoleEnum } from "../enums/role.enum";
import { PermissionStrategyFactory } from "../factories/permission-strategy.factory";
import { IUpdateTopicModel } from "../models/update-topic.model";
import { ITopicRepository } from "../repositories/topic.repository";
import { IUserRepository } from "../repositories/user.repository";
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
    private readonly userRepository: IUserRepository,
    private readonly topicRepository: ITopicRepository,
    private readonly createTopicUseCase: CreateTopicUseCase,
    private readonly getTopicUseCase: GetTopicUseCase
  ) {}

  async execute(id: string, topic: IUpdateTopicModel): Promise<Topic> {
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
