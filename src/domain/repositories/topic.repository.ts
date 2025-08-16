import { Topic } from "../entities/topic";

export interface ITopicRepository {
  create(topic: Topic, oldTopicId?: string): Promise<Topic>;
  get(id: string): Promise<Topic | null>;
  getAll(): Promise<Topic[]>;
  getOneByVersion(stack: string, version: number): Promise<Topic | null>;
  getChildren(parentTopicId: string): Promise<Topic[]>;
  updateTopicHierarchyReference(
    newParentTopicId: string,
    children: Topic[]
  ): Promise<void>;
  getLastVersionByStack(stack: string): Promise<number>;
  transaction(work: (repo: TopicRepository) => Promise<Topic>): Promise<Topic>;
}
