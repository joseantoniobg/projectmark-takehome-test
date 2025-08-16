import { Resource } from "../entities/resource";
import { Topic } from "../entities/topic";

export class TopicFactory {
  static create(
    id: string | undefined,
    version: number | undefined,
    name: string,
    content: string,
    userId: string,
    parentTopicId: string | undefined,
    resourceEntities: Resource[]
  ): Topic {
    return new Topic(
      name,
      content,
      (version ?? 0) + 1,
      userId,
      parentTopicId ?? null,
      resourceEntities,
      id ?? null
    );
  }
}
