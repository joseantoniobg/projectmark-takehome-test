import { User } from "../entities/user";
import { RoleEnum } from "../enums/role.enum";
import { hasInformation, isValidEnumItem } from "../helpers/functions.helpers";
import { CreateUserModel } from "../models/create-user.model";
import { UserRepository } from "../repositories/user.repository";
import {
  ConflictError,
  InternalServerError,
  ValidationError,
} from "./error-handling/app-error";

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(user: CreateUserModel): Promise<User> {
    if (!hasInformation(user.name)) {
      throw new ValidationError("Username must by informed");
    }

    if (!hasInformation(user.email)) {
      throw new ValidationError("User email must be informed");
    }

    if (!isValidEnumItem(RoleEnum, user.role)) {
      throw new ValidationError("Invalid User Role");
    }

    const userWithSameEmail = await this.userRepository.findByEmail(user.email);

    if (userWithSameEmail) {
      throw new ConflictError("E-mail already used");
    }

    const userEntity = new User(user.name, user.email, user.role);

    try {
      return await this.userRepository.create(userEntity);
    } catch (e) {
      throw new InternalServerError();
    }
  }
}
