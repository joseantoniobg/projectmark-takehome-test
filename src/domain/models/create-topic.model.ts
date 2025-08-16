import { ResourceTypeEnum } from "../enums/resource-type.enum";

export type Resource = {
  id?: string;
  url: string;
  description: string;
  type: ResourceTypeEnum;
};

export interface CreateTopicModel {
  name: string;
  content: string;
  resources: Resource[];
  userId: string;
  parentTopicId: string | null;
}
