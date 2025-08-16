import { Topic } from "../entities/topic";
import { TopicRepository } from "../repositories/topic.repository";
import { GetTopicUseCase } from "./get-topic.usecase";

export class GetTopicWithChildrenUseCase {
  constructor(
    private readonly topicRepository: TopicRepository,
    private readonly getTopicUseCase: GetTopicUseCase
  ) {}
  async execute(id: string): Promise<Topic> {
    const topic = await this.getTopicUseCase.execute(id);
    const children = await this.topicRepository.getTopicAndChildren(topic);
    topic.children = children;
    return topic;
  }
}
