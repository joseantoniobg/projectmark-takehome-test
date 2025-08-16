import { generateUuid } from "../helpers/functions.helpers";
import { Resource } from "./resource";
import { User } from "./user";

export class Topic {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  stack: string;
  version: number;
  resources: Resource[];
  userId: string;
  parentTopicId: string | null;
  children: Topic[];

  constructor(
    name: string,
    content: string,
    version: number,
    userId: string,
    parentTopicId: string | null,
    resources: Resource[],
    stack: string | null
  ) {
    this.id = generateUuid();
    this.name = name;
    this.content = content;
    this.version = version;
    this.userId = userId;
    this.stack = stack ?? this.id;
    this.resources = resources;
    this.parentTopicId = parentTopicId;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
