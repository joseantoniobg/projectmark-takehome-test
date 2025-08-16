import { Topic } from "../entities/topic";
import { RoleEnum } from "../enums/role.enum";
import { hasInformation, isValidEnumItem } from "../helpers/functions.helpers";
import { TopicModel } from "../models/topic.model";
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
} from "./error-handling/app-error";

export class CreateTopicUseCase {
  constructor(
    private readonly topicRepository: TopicRepository,
    private readonly userRepository: UserRepository
  ) {}
  async execute(
    topic: TopicModel,
    id?: string,
    user?: User | null,
    version?: number
  ): Promise<Topic> {
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

    if (user.role === RoleEnum.VIEWER) {
      throw new UnauthorizedError("Viewers can not create topics");
    }

    let parentTopic: Topic | null = null;

    if (topic.parentTopicId) {
      parentTopic = await this.topicRepository.get(topic.parentTopicId);

      if (!parentTopic) {
        throw new NotFoundError("Parent Topic not found");
      }
    }

    for (const resource of topic.resources) {
      if (!hasInformation(resource.description)) {
        throw new ValidationError("Resource description is needed");
      }

      if (!hasInformation(resource.url)) {
        throw new ValidationError("Resource URL is needed");
      }

      if (!isValidEnumItem(ResourceTypeEnum, resource.type)) {
        throw new ValidationError("Invalid resource type");
      }
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

    const topicEntity = new Topic(
      topic.name,
      topic.content,
      version ?? 1,
      user,
      parentTopic,
      resourceEntities,
      id
    );

    try {
      return await this.topicRepository.create(topicEntity, id);
    } catch (e) {
      throw new InternalServerError();
    }
  }
}
