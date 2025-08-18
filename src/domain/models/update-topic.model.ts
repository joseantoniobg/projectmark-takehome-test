import { Resource } from "./create-topic.model";

export interface IUpdateTopicModel {
  name: string;
  content: string;
  resources: Resource[];
  userId: string;
}

export interface IUpdateTopicInput {
  id: string;
  topic: IUpdateTopicModel;
}
