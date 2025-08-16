import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { ResourceTypeEnum } from "../../domain/enums/resource-type.enum";

export class ResourceDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString({ message: "URL must be a string" })
  @IsNotEmpty({ message: "URL must be not empty" })
  url: string;

  @IsString({ message: "description must be a string" })
  @IsNotEmpty({ message: "description must be not empty" })
  description: string;

  @IsEnum(ResourceTypeEnum, { message: "Invalid resource type" })
  type: ResourceTypeEnum;
}
