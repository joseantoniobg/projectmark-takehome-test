import { User } from "../entities/user";
import { RoleEnum } from "../enums/role.enum";
import {
  hasInformation,
  isEmail,
  isValidEnumItem,
} from "../helpers/functions.helpers";
import { ILogger } from "../logging/logger";
import { ICreateUserModel } from "../models/create-user.model";
import { IUserRepository } from "../repositories/user.repository";
import { UseCase } from "./abstract/use-case";
import {
  ConflictError,
  InternalServerError,
  ValidationError,
} from "./error-handling/mapped-errors";

export class CreateUserUseCase extends UseCase<ICreateUserModel, User> {
  constructor(
    private readonly userRepository: IUserRepository,
    logger: ILogger
  ) {
    super("createUser", logger);
  }

  async perform(user: ICreateUserModel): Promise<User> {
    if (!hasInformation(user.name)) {
      throw new ValidationError("User name must by informed");
    }

    if (!hasInformation(user.email)) {
      throw new ValidationError("User email must be informed");
    }

    if (!isEmail(user.email)) {
      throw new ValidationError("Invalid user e-mail");
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
