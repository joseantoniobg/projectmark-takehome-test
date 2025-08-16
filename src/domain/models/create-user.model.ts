import { RoleEnum } from "../enums/role.enum";

export interface ICreateUserModel {
  name: string;
  email: string;
  role: RoleEnum;
}
