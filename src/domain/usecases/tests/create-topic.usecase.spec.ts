import { CreateTopicUseCase } from "../create-topic.usecase";
import { RoleEnum } from "../../enums/role.enum";
import { GetTopicUseCase } from "../get-topic.usecase";
import { loggerMock, makeUser, makeTopic } from "../../tests/helpers";
import { Topic } from "../../entities/topic";
import { ICreateTopicInput } from "../../models/create-topic.model";
import {
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../error-handling/mapped-errors";

describe("CreateTopicUseCase", () => {
  let topicRepo: any;
  let userRepo: any;
  let getTopic: any;
  let logger: any;
  let usecase: CreateTopicUseCase;

  beforeEach(() => {
    topicRepo = { create: jest.fn() };
    userRepo = { find: jest.fn() };
    getTopic = { execute: jest.fn() } as unknown as GetTopicUseCase;
    logger = loggerMock();
    usecase = new CreateTopicUseCase(
      topicRepo,
      userRepo,
      getTopic,
      logger
    ) as any;
  });

  it("creates a topic (admin, no parent)", async () => {
    const user = makeUser({ role: RoleEnum.ADMIN });
    userRepo.find.mockResolvedValue(user);
    const expected = makeTopic({ userId: user.id, version: 2 });
    topicRepo.create.mockResolvedValue(expected);

    const input = {
      topic: {
        name: "New",
        content: "Body",
        resources: [],
        userId: user.id,
        parentTopicId: null,
      },
    };

    const result = await usecase.execute(input as any);
    expect(userRepo.find).toHaveBeenCalledWith(user.id);
    expect(topicRepo.create).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });

  it("creates with parentTopicId (calls GetTopicUseCase)", async () => {
    const user = makeUser({ role: RoleEnum.EDITOR });
    userRepo.find.mockResolvedValue(user);
    const parent = makeTopic({ id: "3eda26bb-e450-4fad-9e3e-033dd9472279" });
    getTopic.execute.mockResolvedValue(parent);
    const expected = makeTopic({ parentTopicId: parent.id, userId: user.id });
    topicRepo.create.mockResolvedValue(expected);

    const input = {
      topic: {
        name: "Child",
        content: "X",
        resources: [],
        userId: user.id,
        parentTopicId: parent.id,
      },
    };

    const result = await usecase.execute(input as any);
    expect(getTopic.execute).toHaveBeenCalledWith({ id: parent.id });
    expect(result.parentTopicId).toBe(parent.id);
  });

  it("throws ValidationError when name empty", async () => {
    const user = makeUser();
    userRepo.find.mockResolvedValue(user);
    await expect(
      usecase.execute({
        topic: {
          name: "",
          content: "B",
          userId: user.id,
          resources: [],
          parentTopicId: null,
        },
      } as any)
    ).rejects.toMatchObject(new ValidationError("Topic name must be informed"));
  });

  it("throws AuthorizationError when a Viewer tries to create a topic", async () => {
    const user = makeUser({ role: RoleEnum.VIEWER });
    userRepo.find.mockResolvedValue(user);
    await expect(
      usecase.execute({
        topic: {
          name: "A",
          content: "B",
          userId: user.id,
          resources: [],
          parentTopicId: null,
        },
      } as any)
    ).rejects.toMatchObject(
      new UnauthorizedError("User can not create topics")
    );
  });

  it("throws ValidationError when content empty", async () => {
    const user = makeUser();
    userRepo.find.mockResolvedValue(user);
    await expect(
      usecase.execute({
        topic: {
          name: "A",
          content: "",
          userId: user.id,
          resources: [],
          parentTopicId: null,
        },
      } as any)
    ).rejects.toMatchObject(
      new ValidationError("Topic must have some content")
    );
  });

  it("throws ValidationError when invalid topic id provided (id)", async () => {
    const badId = "not-a-uuid";
    const user = makeUser();
    userRepo.find.mockResolvedValue(user);
    await expect(
      usecase.execute({
        id: badId,
        topic: {
          name: "A",
          content: "B",
          userId: user.id,
          resources: [],
          parentTopicId: null,
        },
      } as any)
    ).rejects.toMatchObject(new ValidationError("Invalid topic id"));
  });

  it("throws ValidationError when invalid user id", async () => {
    await expect(
      usecase.execute({
        topic: {
          name: "A",
          content: "B",
          userId: "bad",
          resources: [],
          parentTopicId: null,
        },
      } as any)
    ).rejects.toMatchObject(new ValidationError("Invalid user id"));
  });

  it("throws NotFoundError when user not found", async () => {
    userRepo.find.mockResolvedValue(null);
    await expect(
      usecase.execute({
        topic: {
          name: "A",
          content: "B",
          userId: "3eda26bb-e450-4fad-9e3e-033dd9472279",
          resources: [],
          parentTopicId: null,
        },
      } as any)
    ).rejects.toMatchObject(new NotFoundError("User not found"));
  });

  it("validates resources", async () => {
    const user = makeUser({ role: RoleEnum.ADMIN });
    userRepo.find.mockResolvedValue(user);

    await expect(
      usecase.execute({
        topic: {
          name: "A",
          content: "B",
          userId: user.id,
          parentTopicId: null,
          resources: [{ url: "https://x", description: "", type: "Article" }],
        },
      } as any)
    ).rejects.toMatchObject(
      new ValidationError("Resource description must be informed")
    );

    await expect(
      usecase.execute({
        topic: {
          name: "A",
          content: "B",
          userId: user.id,
          parentTopicId: null,
          resources: [{ url: "", description: "x", type: "Article" }],
        },
      } as any)
    ).rejects.toMatchObject(
      new ValidationError("Resource URL must be informed")
    );

    await expect(
      usecase.execute({
        topic: {
          name: "A",
          content: "B",
          userId: user.id,
          parentTopicId: null,
          resources: [
            { url: "https://x", description: "x", type: "INVALID" as any },
          ],
        },
      } as any)
    ).rejects.toMatchObject(new ValidationError("Invalid resource type"));
  });

  it("maps unknown repo error to InternalServerError", async () => {
    const user = makeUser({ role: RoleEnum.ADMIN });
    userRepo.find.mockResolvedValue(user);
    topicRepo.create.mockRejectedValue(new Error("DB Error"));

    await expect(
      usecase.execute({
        topic: {
          name: "A",
          content: "B",
          userId: user.id,
          resources: [],
          parentTopicId: null,
        },
      } as ICreateTopicInput)
    ).rejects.toMatchObject(new InternalServerError());
  });
});
