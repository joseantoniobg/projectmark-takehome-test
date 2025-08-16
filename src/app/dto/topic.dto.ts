import { ResourceDto } from "./resource.dto";
export class TopicDto {
  name: string;
  content: string;
  resources: ResourceDto[];
  userId: string;
  parentTopicId: string | null;
}
