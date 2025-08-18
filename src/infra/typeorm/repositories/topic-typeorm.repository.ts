import { Repository } from "typeorm";
import { ITopicRepository } from "../../../domain/repositories/topic.repository";
import { Topic } from "../entities/topic.entity";
import { SqliteDataSource } from "../sqlite-data-source";

export class TopicTypeormRepository implements ITopicRepository {
  private ormRepo: Repository<Topic>;

  constructor() {
    this.ormRepo = SqliteDataSource.getRepository(Topic);
  }

  private filterCurrentChildren(children: Topic[]): Topic[] {
    const latestByStack = new Map<string, Topic>();

    for (const child of children) {
      const existing = latestByStack.get(child.stack);
      if (!existing || child.version > existing.version) {
        latestByStack.set(child.stack, child);
      }
    }

    return Array.from(latestByStack.values());
  }

  async get(id: string): Promise<Topic | null> {
    return await this.ormRepo.findOne({
      where: { id },
      relations: ["resources"],
    });
  }

  async getWithParentAndCurrentChildren(id: string): Promise<Topic> {
    const topic = await this.ormRepo.findOneOrFail({
      select: ["id", "name", "version"],
      where: { id },
      relations: ["parentTopic", "children"],
    });
    topic.children = this.filterCurrentChildren(topic.children);
    return topic;
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

  async getAllChildren(parentTopicId: string): Promise<Topic[]> {
    return await this.ormRepo.find({
      where: { parentTopicId },
      relations: ["resources", "children"],
    });
  }

  async getCurrentChildren(parentTopicId: string): Promise<Topic[]> {
    let children = await this.ormRepo.find({
      where: { parentTopicId },
      relations: ["resources", "children"],
    });
    return this.filterCurrentChildren(children);
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
