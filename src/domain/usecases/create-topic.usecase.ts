import { Topic } from "../entities/topic";
import {
  hasInformation,
  isValidEnumItem,
  validateUuid,
} from "../helpers/functions.helpers";
import {
  ICreateTopicInput,
  ICreateTopicModel,
} from "../models/create-topic.model";
import { ITopicRepository } from "../repositories/topic.repository";
import { IUserRepository } from "../repositories/user.repository";
import { ResourceTypeEnum } from "../enums/resource-type.enum";
import { Resource } from "../entities/resource";
import { User } from "../entities/user";
import {
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "./error-handling/mapped-errors";
import { TopicFactory } from "../factories/topic.factory";
import { PermissionStrategyFactory } from "../factories/permission-strategy.factory";
import { GetTopicUseCase } from "./get-topic.usecase";
import { ILogger } from "../logging/logger";
import { UseCase } from "./abstract/use-case";

export class CreateTopicUseCase extends UseCase<ICreateTopicInput, Topic> {
  constructor(
    private readonly topicRepository: ITopicRepository,
    private readonly userRepository: IUserRepository,
    private readonly getTopicUseCase: GetTopicUseCase,
    logger: ILogger
  ) {
    super("CreateTopic", logger);
  }
  async perform(input: ICreateTopicInput): Promise<Topic> {
    const { topic, id, transactionRepostory, version } = input;
    let { user } = input;

    const repository = transactionRepostory ?? this.topicRepository;

    if (!hasInformation(topic.name)) {
      throw new ValidationError("Topic name must be informed");
    }

    if (!hasInformation(topic.content)) {
      throw new ValidationError("Topic must have some content");
    }

    if (id && !validateUuid(id)) {
      throw new ValidationError("Invalid topic id");
    }

    if (!user) {
      if (!validateUuid(topic.userId)) {
        throw new ValidationError("Invalid user id");
      }
      user = await this.userRepository.find(topic.userId);
    }

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const userPermissions = PermissionStrategyFactory.create(user.role);

    if (!userPermissions.canCreate()) {
      throw new UnauthorizedError("User can not create topics");
    }

    for (const resource of topic.resources) {
      if (!hasInformation(resource.description)) {
        throw new ValidationError("Resource description must be informed");
      }

      if (!hasInformation(resource.url)) {
        throw new ValidationError("Resource URL must be informed");
      }

      if (!isValidEnumItem(ResourceTypeEnum, resource.type)) {
        throw new ValidationError("Invalid resource type");
      }
    }

    let parentTopic: Topic | null = null;

    if (topic.parentTopicId) {
      parentTopic = await this.getTopicUseCase.execute({
        id: topic.parentTopicId,
      });
    }

    const resourceEntities = topic.resources.map(
      (resource) =>
        new Resource(
          resource.url,
          resource.description,
          resource.type,
          resource.id
        )
    );

    const topicEntity = TopicFactory.create(
      id,
      version,
      topic.name,
      topic.content,
      user.id,
      parentTopic?.id,
      resourceEntities
    );

    return await repository.create(topicEntity, id);
  }
}
