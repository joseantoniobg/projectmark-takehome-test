import { Topic } from "../entities/topic";
import { ITopicRepository } from "../repositories/topic.repository";
import {
  InternalServerError,
  ValidationError,
} from "./error-handling/mapped-errors";
import { GetTopicUseCase } from "./get-topic.usecase";

export class GetTopicWithChildrenUseCase {
  constructor(
    private readonly topicRepository: ITopicRepository,
    private readonly getTopicUseCase: GetTopicUseCase
  ) {}

  private async recursiveChildTopics(topic: Topic): Promise<Topic> {
    let children = await this.topicRepository.getChildren(topic.id);
    topic.children = [];

    const latestByStack = new Map<string, Topic>();

    for (const child of children) {
      const existing = latestByStack.get(child.stack);
      if (!existing || child.version > existing.version) {
        latestByStack.set(child.stack, child);
      }
    }

    children = Array.from(latestByStack.values());

    for (const child of children) {
      const childWithDescendants = await this.recursiveChildTopics(child);
      topic.children.push(childWithDescendants);
    }

    return topic;
  }

  async execute(id: string): Promise<Topic> {
    if (!id) {
      throw new ValidationError("Id must be informed");
    }

    const rootTopic = await this.getTopicUseCase.execute(id);
    try {
      return await this.recursiveChildTopics(rootTopic);
    } catch (e) {
      throw new InternalServerError();
    }
  }
}
