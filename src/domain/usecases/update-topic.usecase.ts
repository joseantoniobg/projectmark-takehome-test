import { Topic } from "../entities/topic";
import { PermissionStrategyFactory } from "../factories/permission-strategy.factory";
import { validateUuid } from "../helpers/functions.helpers";
import { ILogger } from "../logging/logger";
import { ICreateTopicInput } from "../models/create-topic.model";
import { IUpdateTopicInput } from "../models/update-topic.model";
import { ITopicRepository } from "../repositories/topic.repository";
import { IUserRepository } from "../repositories/user.repository";
import { UseCase } from "./abstract/use-case";
import { CreateTopicUseCase } from "./create-topic.usecase";
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "./error-handling/mapped-errors";
import { GetTopicUseCase } from "./get-topic.usecase";

export class UpdateTopicUseCase extends UseCase<IUpdateTopicInput, Topic> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly topicRepository: ITopicRepository,
    private readonly createTopicUseCase: CreateTopicUseCase,
    private readonly getTopicUseCase: GetTopicUseCase,
    logger: ILogger
  ) {
    super("UpdateTopic", logger);
  }

  async perform(input: IUpdateTopicInput): Promise<Topic> {
    const { id, topic } = input;

    if (!validateUuid(topic.userId)) {
      throw new ValidationError("Invalid user id");
    }

    const user = await this.userRepository.find(topic.userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const userPermissions = PermissionStrategyFactory.create(user.role);

    if (!userPermissions.canEditOwnTopic()) {
      throw new UnauthorizedError("User can't edit topics");
    }

    const originalTopic = await this.getTopicUseCase.execute({ id });

    if (
      originalTopic.userId !== user.id &&
      !userPermissions.canEditAnyTopic()
    ) {
      throw new UnauthorizedError("User can't edit this topic");
    }

    return this.topicRepository.transaction(async (repository) => {
      const createTopicInput: ICreateTopicInput = {
        topic: { ...topic, parentTopicId: originalTopic.parentTopicId },
        id: originalTopic.id,
        user,
        version: originalTopic.version,
        transactionRepostory: repository,
      };

      const newTopic = await this.createTopicUseCase.execute(createTopicInput);

      const children = await repository.getAllChildren(originalTopic.id);
      await repository.updateTopicHierarchyReference(newTopic.id, children);
      return newTopic;
    });
  }
}
