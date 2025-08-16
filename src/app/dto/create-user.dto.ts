import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from "class-validator";
import { RoleEnum } from "../../domain/enums/role.enum";

export class CreateUserDto {
  @IsString({ message: "User must be a string" })
  @IsNotEmpty({ message: "User must be not empty" })
  @MaxLength(100, { message: "User name must have max of 100 characters" })
  name: string;

  @IsEmail({}, { message: "Must e-mail must be valid" })
  email: string;

  @IsEnum(RoleEnum, { message: "Invalid role" })
  role: RoleEnum;
}
