import { Topic } from "../entities/topic";
import { TopicRepository } from "../repositories/topic.repository";

export class GetAllTopicsUseCase {
  constructor(private readonly topicRepository: TopicRepository) {}

  async execute(): Promise<Topic[]> {
    return this.topicRepository.getAll();
  }
}
