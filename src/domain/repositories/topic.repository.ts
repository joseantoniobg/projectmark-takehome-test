import { Topic } from "../entities/topic";

export interface TopicRepository {
  create(topic: Topic, oldTopicId?: string): Promise<Topic>;
  get(id: string): Promise<Topic | null>;
  getOneByVersion(stack: string, version: number): Promise<Topic | null>;
  getTopicAndChildren(topic: Topic): Promise<Topic[]>;
  getLastVersionByStack(stack: string): Promise<number>;
}
