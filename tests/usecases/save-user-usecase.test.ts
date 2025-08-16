import { CreateUserUseCase } from "../../src/domain/usecases/create-user.usecase";
import { CreateUserModel } from "../../src/domain/models/create-user.model";
import { UserRepository } from "../../src/domain/repositories/user.repository";
import { User } from "../../src/domain/entities/user";
import { RoleEnum } from "../../src/domain/enums/role.enum";

const mockUserRepository: jest.Mocked<UserRepository> = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
};

let createUserUseCase: CreateUserUseCase;

describe("CreateUserUsecase", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    createUserUseCase = new CreateUserUseCase(mockUserRepository);
  });

  it("should create and return a new user successfully", async () => {
    const userToCreate: CreateUserModel = {
      name: "John Doe",
      email: "john.doe@example.com",
      role: RoleEnum.ADMIN,
    };

    const expectedUser: User = {
      id: "1",
      createdAt: new Date(),
      ...userToCreate,
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.create.mockResolvedValue(expectedUser);

    const result = await createUserUseCase.execute(userToCreate);

    expect(result).toEqual(expectedUser);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      userToCreate.email
    );
    expect(mockUserRepository.create).toHaveBeenCalled();
  });

  it("should throw an error if username is not provided", async () => {
    const userToCreate: CreateUserModel = {
      name: "",
      email: "john.doe@example.com",
      role: RoleEnum.ADMIN,
    };

    await expect(createUserUseCase.execute(userToCreate)).rejects.toThrow(
      "Username must by informed"
    );
  });

  it("should throw an error if user email is not provided", async () => {
    const userToCreate: CreateUserModel = {
      name: "John Doe",
      email: "",
      role: RoleEnum.EDITOR,
    };

    await expect(createUserUseCase.execute(userToCreate)).rejects.toThrow(
      "User email must be informed"
    );
  });

  it("should throw an error if the user role is invalid", async () => {
    const userToCreate: any = {
      name: "John Doe",
      email: "john.doe@example.com",
      role: "INVALID_ROLE",
    };

    await expect(createUserUseCase.execute(userToCreate)).rejects.toThrow(
      "Invalid User Role"
    );
  });

  it("should throw an error if the email is already used", async () => {
    const userToCreate: CreateUserModel = {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      role: RoleEnum.ADMIN,
    };

    const existingUser: User = {
      id: "4",
      name: "Existing Jane",
      email: "jane.doe@example.com",
      role: RoleEnum.VIEWER,
      createdAt: new Date(),
    };

    mockUserRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(createUserUseCase.execute(userToCreate)).rejects.toThrow(
      "E-mail already used"
    );
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      userToCreate.email
    );

    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });
});
