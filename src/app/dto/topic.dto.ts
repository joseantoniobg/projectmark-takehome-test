import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";
import { ResourceDto } from "./resource.dto";
import { Type } from "class-transformer";

export class TopicDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @ValidateNested({ each: true })
  @Type(() => ResourceDto)
  resources: ResourceDto[];

  @IsUUID("4")
  userId: string;

  @IsUUID("4")
  @IsOptional()
  parentTopicId?: string;
}
