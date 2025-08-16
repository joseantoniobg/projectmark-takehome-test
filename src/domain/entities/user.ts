import { RoleEnum } from "../enums/role.enum";
import { generateUuid } from "../helpers/functions.helpers";

export class User {
  id: string;
  name: string;
  email: string;
  role: RoleEnum;
  createdAt: Date;

  constructor(name: string, email: string, role: RoleEnum) {
    this.id = generateUuid();
    this.name = name;
    this.email = email;
    this.role = role;
    this.createdAt = new Date();
  }
}
