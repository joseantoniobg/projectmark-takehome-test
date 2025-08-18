import { GetTopicUseCase } from "../get-topic.usecase";
import { loggerMock, makeTopic } from "../../tests/helpers";
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  ValidationError,
} from "../error-handling/mapped-errors";

describe("GetTopicUseCase", () => {
  let repo: any;
  let logger: any;
  let usecase: GetTopicUseCase;

  beforeEach(() => {
    repo = {
      get: jest.fn(),
      getOneByVersion: jest.fn(),
      getLastVersionByStack: jest.fn(),
    };
    logger = loggerMock();
    usecase = new GetTopicUseCase(repo, logger) as any;
  });

  it("requires id", async () => {
    await expect(usecase.execute({ id: "" } as any)).rejects.toMatchObject(
      new ValidationError("Id must be informed")
    );
  });

  it("gets by id (no version)", async () => {
    const t = makeTopic({
      id: "d001b236-9943-449c-87ec-451c82258e8e",
      version: 3,
    });
    repo.getLastVersionByStack.mockResolvedValue(3);
    repo.get.mockResolvedValue(t);
    const result = await usecase.execute({ id: t.id } as any);
    expect(repo.get).toHaveBeenCalledWith(t.id);
    expect(result).toEqual(t);
  });

  it("throws NotFound if base not found", async () => {
    repo.get.mockResolvedValue(null);
    await expect(
      usecase.execute({ id: "d001b236-9943-449c-87ec-451c82258e8e" } as any)
    ).rejects.toMatchObject(new NotFoundError("Topic not found"));
  });

  it("throws ConflictError('Outdated topic') when client version older than current", async () => {
    const current = makeTopic({
      id: "d001b236-9943-449c-87ec-451c82258e8e",
      version: 4,
      stack: "stack-1",
    });
    repo.get.mockResolvedValue(current);
    repo.getLastVersionByStack.mockResolvedValue(5);

    await expect(
      usecase.execute({ id: current.id, version: 4 } as any)
    ).rejects.toMatchObject(new ConflictError("Outdated topic"));
  });

  it("returns specific version via getOneByVersion", async () => {
    const base = makeTopic({
      id: "d001b236-9943-449c-87ec-451c82258e8e",
      version: 3,
      stack: "stack-1",
    });
    const v2 = makeTopic({
      id: "cedf7e55-8af8-406a-80b2-42df46a634a9",
      version: 2,
      stack: "stack-1",
    });
    repo.get.mockResolvedValue(base);
    repo.getOneByVersion.mockResolvedValue(v2);
    const result = await usecase.execute({ id: base.id, version: 2 } as any);
    expect(repo.getOneByVersion).toHaveBeenCalledWith(base.stack, 2);
    expect(result.version).toBe(2);
  });

  it("maps repo error during getOneByVersion to InternalServerError", async () => {
    const base = makeTopic({
      id: "d001b236-9943-449c-87ec-451c82258e8e",
      version: 3,
      stack: "stack-1",
    });
    repo.get.mockResolvedValue(base);
    repo.getOneByVersion.mockRejectedValue(new Error("db down"));
    await expect(
      usecase.execute({ id: base.id, version: 3 } as any)
    ).rejects.toMatchObject(new InternalServerError());
  });
});
