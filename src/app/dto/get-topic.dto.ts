import { Transform, Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsUUID } from "class-validator";

export class GetTopicDto {
  @IsUUID("4")
  id: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  version?: number;
}
