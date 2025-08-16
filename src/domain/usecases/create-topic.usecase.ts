import { Topic } from "../entities/topic";
import { hasInformation, isValidEnumItem } from "../helpers/functions.helpers";
import { CreateTopicModel } from "../models/create-topic.model";
import { TopicRepository } from "../repositories/topic.repository";
import { UserRepository } from "../repositories/user.repository";
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

export class CreateTopicUseCase {
  constructor(
    private readonly topicRepository: TopicRepository,
    private readonly userRepository: UserRepository,
    private readonly getTopicUseCase: GetTopicUseCase
  ) {}
  async execute(
    topic: CreateTopicModel,
    id?: string,
    user?: User | null,
    version?: number,
    transactionRepostory?: TopicRepository
  ): Promise<Topic> {
    const repository = transactionRepostory ?? this.topicRepository;

    if (!hasInformation(topic.name)) {
      throw new ValidationError("Topic name must be informed");
    }

    if (!hasInformation(topic.content)) {
      throw new ValidationError("Topic must have some content");
    }

    if (!user) {
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
      parentTopic = await this.getTopicUseCase.execute(topic.parentTopicId);
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

    try {
      return await repository.create(topicEntity, id);
    } catch (e: any) {
      throw new InternalServerError(e.message);
    }
  }
}
