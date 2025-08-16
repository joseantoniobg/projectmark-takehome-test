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
  user: User;
  parentTopicId?: string;
  parentTopic: Topic | null;
  children: Topic[];

  constructor(
    name: string,
    content: string,
    version: number,
    user: User,
    parentTopic: Topic | null,
    resources: Resource[],
    stack?: string
  ) {
    this.id = generateUuid();
    this.name = name;
    this.content = content;
    this.version = version;
    this.user = user;
    this.stack = stack ?? this.id;
    this.resources = resources;
    this.parentTopic = parentTopic;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
