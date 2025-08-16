import { ResourceTypeEnum } from "../enums/resource-type.enum";

type Resource = {
  id?: string;
  url: string;
  description: string;
  type: ResourceTypeEnum;
};

export interface TopicModel {
  name: string;
  content: string;
  resources: Resource[];
  userId: string;
  parentTopicId?: string;
}
