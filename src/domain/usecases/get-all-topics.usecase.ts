import { Topic } from "../entities/topic";
import { ITopicRepository } from "../repositories/topic.repository";

export class GetAllTopicsUseCase {
  constructor(private readonly topicRepository: ITopicRepository) {}

  async execute(): Promise<Topic[]> {
    return this.topicRepository.getAll();
  }
}
