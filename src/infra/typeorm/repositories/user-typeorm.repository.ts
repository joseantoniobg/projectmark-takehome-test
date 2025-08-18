import { injectable } from "tsyringe";
import { ICreateUserModel } from "../../../domain/models/create-user.model";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { SqliteDataSource } from "../sqlite-data-source";

@injectable()
export class UserTypeormRepository implements IUserRepository {
  private ormRepo: Repository<User>;

  constructor() {
    this.ormRepo = SqliteDataSource.getRepository(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.ormRepo.findOne({ where: { email } });
  }

  async find(id: string): Promise<User | null> {
    return await this.ormRepo.findOne({ where: { id } });
  }

  async create(user: ICreateUserModel): Promise<User> {
    return await this.ormRepo.save(user);
  }
}
