import { Resource } from "./create-topic.model";

export interface UpdateTopicModel {
  name: string;
  content: string;
  resources: Resource[];
  userId: string;
}
