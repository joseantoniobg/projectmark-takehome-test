import { ResourceTypeEnum } from "../../domain/enums/resource-type.enum";

export class ResourceDto {
  id?: string;
  url: string;
  description: string;
  type: ResourceTypeEnum;
}
