import { User } from "../entities/user";
import { ResourceTypeEnum } from "../enums/resource-type.enum";
import { ITopicRepository } from "../repositories/topic.repository";

export type Resource = {
  id?: string;
  url: string;
  description: string;
  type: ResourceTypeEnum;
};

export interface ICreateTopicModel {
  name: string;
  content: string;
  resources: Resource[];
  userId: string;
  parentTopicId: string | null;
}

export interface ICreateTopicInput {
  topic: ICreateTopicModel;
  id?: string;
  user?: User | null;
  version?: number;
  transactionRepostory?: ITopicRepository;
}
