import { Topic } from "../entities/topic";

export interface IPathTopicsModel {
  length: number;
  topics: Pick<Topic, "id" | "name" | "version">[];
}
