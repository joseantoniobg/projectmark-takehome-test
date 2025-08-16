import { RoleEnum } from "../../domain/enums/role.enum";

export class CreateUserDto {
  name: string;
  email: string;
  role: RoleEnum;
}
