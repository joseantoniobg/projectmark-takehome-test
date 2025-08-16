import { ResourceTypeEnum } from "../enums/resource-type.enum";
import { generateUuid } from "../helpers/functions.helpers";

export class Resource {
  id: string;
  topicId: string;
  url: string;
  description: string;
  type: ResourceTypeEnum;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    url: string,
    description: string,
    type: ResourceTypeEnum,
    id?: string
  ) {
    this.id = id ?? generateUuid();
    this.url = url;
    this.description = description;
    this.type = type;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
