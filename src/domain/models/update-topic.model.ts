import { Resource } from "./create-topic.model";

export interface IUpdateTopicModel {
  name: string;
  content: string;
  resources: Resource[];
  userId: string;
}
