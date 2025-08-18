import { CreateUserUseCase } from "../create-user.usecase";
import { RoleEnum } from "../../enums/role.enum";
import { loggerMock } from "../../tests/helpers";
import {
  InternalServerError,
  ValidationError,
} from "../error-handling/mapped-errors";

describe("CreateUserUseCase", () => {
  let repo: any;
  let uc: CreateUserUseCase;

  beforeEach(() => {
    repo = { findByEmail: jest.fn(), create: jest.fn() };
    uc = new CreateUserUseCase(repo as any, loggerMock() as any) as any;
  });

  it("shold validate name, email and role", async () => {
    await expect(
      uc.execute({ name: "", email: "x@a.com", role: RoleEnum.ADMIN } as any)
    ).rejects.toMatchObject(new ValidationError("User name must by informed"));
    await expect(
      uc.execute({ name: "A", email: "bad", role: RoleEnum.ADMIN } as any)
    ).rejects.toMatchObject(new ValidationError("Invalid user e-mail"));
    await expect(
      uc.execute({ name: "A", email: "a@b.com", role: "NOPE" as any } as any)
    ).rejects.toMatchObject(new ValidationError("Invalid User Role"));
  });

  it("should throw ConflictError when email already used", async () => {
    repo.findByEmail.mockResolvedValue({ id: "u1" });
    await expect(
      uc.execute({ name: "A", email: "a@b.com", role: RoleEnum.ADMIN } as any)
    ).rejects.toMatchObject(new ValidationError("E-mail already used"));
  });

  it("should create a user when ok", async () => {
    repo.findByEmail.mockResolvedValue(null);
    repo.create.mockResolvedValue({ id: "u1", name: "A" });
    const result = await uc.execute({
      name: "A",
      email: "a@b.com",
      role: RoleEnum.EDITOR,
    } as any);
    expect(result.id).toBe("u1");
  });

  it("should throw InternalServerError when some unexpected error occurs", async () => {
    repo.findByEmail.mockResolvedValue(null);
    repo.create.mockRejectedValue(new Error("db down"));
    await expect(
      uc.execute({ name: "A", email: "a@b.com", role: RoleEnum.EDITOR } as any)
    ).rejects.toMatchObject(new InternalServerError());
  });
});
