import { Repository } from "typeorm";
import { TopicRepository } from "../../../domain/repositories/topic.repository";
import { Topic } from "../entities/topic.entity";
import { SqliteDataSource } from "../sqlite-data-source";

export class TopicTypeormRepository implements TopicRepository {
  private ormRepo: Repository<Topic>;

  constructor() {
    this.ormRepo = SqliteDataSource.getRepository(Topic);
  }

  async get(id: string): Promise<Topic | null> {
    return await this.ormRepo.findOne({
      where: { id },
      relations: ["resources"],
    });
  }

  async updateTopicHierarchyReference(
    newParentTopicId: string,
    children: Topic[]
  ): Promise<void> {
    for (const topic of children) {
      await this.ormRepo.update(
        { id: topic.id },
        { parentTopicId: newParentTopicId }
      );
    }
  }

  async getChildren(parentTopicId: string): Promise<Topic[]> {
    return await this.ormRepo.find({
      where: { parentTopicId },
      relations: ["resources", "children"],
    });
  }

  async getLastVersionByStack(stack: string): Promise<number> {
    const topic = await this.ormRepo.findOne({
      where: { stack: stack },
      order: { version: "DESC" },
      select: ["version"],
    });
    return topic?.version ?? 0;
  }

  async getOneByVersion(stack: string, version: number): Promise<Topic | null> {
    const topic = await this.ormRepo.findOne({
      where: { stack, version },
      relations: ["resources"],
    });
    return topic;
  }

  async create(topic: Topic): Promise<Topic> {
    return await this.ormRepo.save(topic);
  }

  async getAll(): Promise<Topic[]> {
    return await this.ormRepo.find();
  }

  async transaction(
    work: (repo: TopicTypeormRepository) => Promise<Topic>
  ): Promise<Topic> {
    return SqliteDataSource.transaction(async () => {
      const transactionRepo = new TopicTypeormRepository();
      return work(transactionRepo);
    });
  }
}
