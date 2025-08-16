import { inject, injectable } from "tsyringe";
import { CreateUserUseCase } from "../../domain/usecases/create-user.usecase";
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../../infra/typeorm/entities/user.entity";

@injectable()
export class UserService {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  async createUser(user: CreateUserDto): Promise<User> {
    return await this.createUserUseCase.execute(user);
  }
}
