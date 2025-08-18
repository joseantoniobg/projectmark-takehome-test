import { injectable } from "tsyringe";
import { CreateTopicUseCase } from "../../domain/usecases/create-topic.usecase";
import { TopicDto } from "../dto/topic.dto";
import { Topic } from "../../infra/typeorm/entities/topic.entity";
import { UpdateTopicUseCase } from "../../domain/usecases/update-topic.usecase";
import { GetTopicDto } from "../dto/get-topic.dto";
import { GetTopicUseCase } from "../../domain/usecases/get-topic.usecase";
import { GetTopicWithChildrenUseCase } from "../../domain/usecases/get-topic-with-children.usecase";
import { GetAllTopicsUseCase } from "../../domain/usecases/get-all-topics.usecase";
import { FindTopicsPathDto } from "../dto/find-topics-path.dto";
import { FindShortestPathBetweenTwoTopicsUseCase } from "../../domain/usecases/find-shortest-path-between-two-topics.usecase";
import { FindTopicsReturnDto } from "../dto/find-topics-return.dto";

@injectable()
export class TopicService {
  constructor(
    private readonly createTopicUseCase: CreateTopicUseCase,
    private readonly updateTopicUseCase: UpdateTopicUseCase,
    private readonly getTopicUseCase: GetTopicUseCase,
    private readonly getTopicWithChildrenUseCase: GetTopicWithChildrenUseCase,
    private readonly getAllTopicsUseCase: GetAllTopicsUseCase,
    private readonly findShortestPathBetweenTwoTopicsUseCase: FindShortestPathBetweenTwoTopicsUseCase
  ) {}

  async getTopic(topic: GetTopicDto): Promise<Topic> {
    return this.getTopicUseCase.execute(topic);
  }

  async getTopicWithChildren(topic: GetTopicDto): Promise<Topic> {
    return this.getTopicWithChildrenUseCase.execute(topic.id);
  }

  async createTopic(topic: TopicDto): Promise<Topic> {
    return await this.createTopicUseCase.execute({ topic });
  }

  async updateTopic(id: string, topic: TopicDto): Promise<Topic> {
    return await this.updateTopicUseCase.execute({ id, topic });
  }

  async findShortestPathBetweenTwoTopics(
    topics: FindTopicsPathDto
  ): Promise<FindTopicsReturnDto> {
    return await this.findShortestPathBetweenTwoTopicsUseCase.execute(topics);
  }

  async getAll(): Promise<Topic[]> {
    return await this.getAllTopicsUseCase.execute();
  }
}
