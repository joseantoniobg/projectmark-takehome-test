import { User } from "../entities/user";

export interface IUserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  find(id: string): Promise<User | null>;
}
