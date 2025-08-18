import { UpdateTopicUseCase } from "../update-topic.usecase";
import { CreateTopicUseCase } from "../create-topic.usecase";
import { GetTopicUseCase } from "../get-topic.usecase";
import { RoleEnum } from "../../enums/role.enum";
import { loggerMock, makeUser, makeTopic } from "../../tests/helpers";
import {
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../error-handling/mapped-errors";

describe("UpdateTopicUseCase", () => {
  let userRepo: any;
  let topicRepo: any;
  let createTopic: any;
  let getTopic: any;
  let logger: any;
  let usecase: UpdateTopicUseCase;

  beforeEach(() => {
    userRepo = { find: jest.fn() };
    topicRepo = {
      transaction: jest.fn(),
      getAllChildren: jest.fn(),
      updateTopicHierarchyReference: jest.fn(),
    };
    createTopic = { execute: jest.fn() } as unknown as CreateTopicUseCase;
    getTopic = { execute: jest.fn() } as unknown as GetTopicUseCase;
    logger = loggerMock();
    usecase = new UpdateTopicUseCase(
      userRepo,
      topicRepo,
      createTopic,
      getTopic,
      logger
    ) as any;
  });

  it("should update successfully since admin can update any topic", async () => {
    const admin = makeUser({ role: RoleEnum.ADMIN });
    userRepo.find.mockResolvedValue(admin);
    const original = makeTopic({
      id: "83e0246c-141f-46d2-8db6-79fd1f987fab",
      userId: "fffc1fbc-d54c-4f84-b010-d9813fafc778",
      stack: "stack-1",
      version: 3,
      children: [],
    });
    getTopic.execute.mockResolvedValue(original);
    const newTopic = makeTopic({
      id: "c361c6b1-2287-450e-b392-cc61715210b6",
      version: 4,
      parentTopicId: original.parentTopicId,
    });
    createTopic.execute.mockResolvedValue(newTopic);
    topicRepo.getAllChildren.mockResolvedValue([]);
    topicRepo.updateTopicHierarchyReference.mockResolvedValue(undefined);

    topicRepo.transaction.mockImplementation(async (work: Function) => {
      const txRepo = {
        getAllChildren: topicRepo.getAllChildren,
        updateTopicHierarchyReference: topicRepo.updateTopicHierarchyReference,
      };
      return await work(txRepo);
    });

    const dto = {
      id: original.id,
      topic: {
        name: "New Name",
        userId: "c361c6b1-2287-450e-b392-cc61715210b6",
      },
    } as any;
    const result = await usecase.execute(dto);
    expect(getTopic.execute).toHaveBeenCalledWith({ id: original.id });
    expect(createTopic.execute).toHaveBeenCalled();
    expect(topicRepo.updateTopicHierarchyReference).toHaveBeenCalledWith(
      newTopic.id,
      []
    );
    expect(result).toEqual(newTopic);
  });

  it("should validates user id", async () => {
    await expect(
      usecase.execute({
        id: "83e0246c-141f-46d2-8db6-79fd1f987fab",
        topic: { name: "X" },
        user: { id: "bad", role: RoleEnum.ADMIN },
      } as any)
    ).rejects.toMatchObject(new ValidationError("Invalid user id"));
  });

  it("should throw NotFoundError when user not found", async () => {
    userRepo.find.mockResolvedValue(null);
    await expect(
      usecase.execute({
        id: "83e0246c-141f-46d2-8db6-79fd1f987fab",
        topic: { name: "X", userId: "c361c6b1-2287-450e-b392-cc61715210b6" },
        user: {
          id: "acaa4273-bb25-4fde-b0eb-29b8ff2632c4",
          role: RoleEnum.ADMIN,
        },
      } as any)
    ).rejects.toMatchObject(new NotFoundError("User not found"));
  });

  it("should throw UnauthorizedError when role cannot edit topics", async () => {
    const viewer = makeUser({ role: RoleEnum.VIEWER });
    userRepo.find.mockResolvedValue(viewer);
    const original = makeTopic({
      id: "83e0246c-141f-46d2-8db6-79fd1f987fab",
      userId: viewer.id,
    });
    getTopic.execute.mockResolvedValue(original);
    await expect(
      usecase.execute({
        id: original.id,
        topic: { name: "X", userId: "c361c6b1-2287-450e-b392-cc61715210b6" },
        user: viewer,
      } as any)
    ).rejects.toMatchObject(new UnauthorizedError("User can't edit topics"));
  });

  it("should throw UnauthorizedError when editor tries to edit other's topic", async () => {
    const editor = makeUser({
      role: RoleEnum.EDITOR,
      id: "d9a63663-c685-4992-9562-8025528accc2",
    });
    userRepo.find.mockResolvedValue(editor);
    const someoneElses = makeTopic({
      id: "83e0246c-141f-46d2-8db6-79fd1f987fab",
      userId: "5d6041ac-51f4-4102-ba47-af06c2af9d55",
    });
    getTopic.execute.mockResolvedValue(someoneElses);
    await expect(
      usecase.execute({
        id: someoneElses.id,
        topic: { name: "X", userId: "c361c6b1-2287-450e-b392-cc61715210b6" },
        user: editor,
      } as any)
    ).rejects.toMatchObject(
      new UnauthorizedError("User can't edit this topic")
    );
  });

  it("should throw a InternalServerError when unexpected error occurs", async () => {
    const admin = makeUser({ role: RoleEnum.ADMIN });
    userRepo.find.mockResolvedValue(admin);
    const original = makeTopic({
      id: "83e0246c-141f-46d2-8db6-79fd1f987fab",
      userId: admin.id,
    });
    getTopic.execute.mockResolvedValue(original);
    topicRepo.transaction.mockRejectedValue(new Error("Network Error"));
    await expect(
      usecase.execute({
        id: original.id,
        topic: { name: "X", userId: "c361c6b1-2287-450e-b392-cc61715210b6" },
        user: admin,
      } as any)
    ).rejects.toMatchObject(new InternalServerError());
  });
});
