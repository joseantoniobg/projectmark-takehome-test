import { Topic } from "../entities/topic";
import { ILogger } from "../logging/logger";
import { ITopicRepository } from "../repositories/topic.repository";
import { UseCase } from "./abstract/use-case";
import {
  InternalServerError,
  ValidationError,
} from "./error-handling/mapped-errors";
import { GetTopicUseCase } from "./get-topic.usecase";

export class GetTopicWithChildrenUseCase extends UseCase<string, Topic> {
  constructor(
    private readonly topicRepository: ITopicRepository,
    private readonly getTopicUseCase: GetTopicUseCase,
    logger: ILogger
  ) {
    super("GetTopicWithChildren", logger);
  }

  private async recursiveChildTopics(topic: Topic): Promise<Topic> {
    let children = await this.topicRepository.getCurrentChildren(topic.id);
    topic.children = [];

    for (const child of children) {
      const childWithDescendants = await this.recursiveChildTopics(child);
      topic.children.push(childWithDescendants);
    }

    return topic;
  }

  async perform(id: string): Promise<Topic> {
    if (!id) {
      throw new ValidationError("Id must be informed");
    }

    const rootTopic = await this.getTopicUseCase.execute({ id });
    try {
      return await this.recursiveChildTopics(rootTopic);
    } catch (e) {
      throw new InternalServerError();
    }
  }
}
