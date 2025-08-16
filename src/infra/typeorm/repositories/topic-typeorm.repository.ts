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
      order: { version: "DESC" },
    });
  }

  async getTopicAndChildren(topic: Topic): Promise<Topic[]> {
    const topics = await this.ormRepo.find({
      where: { parentTopicId: topic.id },
      relations: ["children"],
    });

    for (const topic of topics) {
      topic.children = await this.getTopicAndChildren(topic);
    }

    return topics;
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
    return await this.ormRepo.findOne({ where: { stack, version } });
  }

  async create(topic: Topic, oldTopicId?: string): Promise<Topic> {
    const connection = this.ormRepo.manager.connection;
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newTopic = await queryRunner.manager.save(Topic, topic);

      if (oldTopicId) {
        await queryRunner.manager.update(
          Topic,
          { parentTopicId: oldTopicId },
          { parentTopicId: newTopic.id }
        );
      }

      await queryRunner.commitTransaction();
      return newTopic;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
