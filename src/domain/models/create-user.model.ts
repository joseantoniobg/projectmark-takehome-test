import { RoleEnum } from "../enums/role.enum";

export interface CreateUserModel {
  name: string;
  email: string;
  role: RoleEnum;
}
