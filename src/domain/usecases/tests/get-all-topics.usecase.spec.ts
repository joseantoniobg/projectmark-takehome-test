import { GetAllTopicsUseCase } from "../get-all-topics.usecase";
import { loggerMock, makeTopic } from "../../tests/helpers";
import { InternalServerError } from "../error-handling/mapped-errors";

describe("GetAllTopicsUseCase", () => {
  it("should return all topics", async () => {
    const repo = {
      getAll: jest.fn().mockResolvedValue([makeTopic({}), makeTopic({})]),
    };
    const uc = new GetAllTopicsUseCase(repo as any, loggerMock() as any) as any;
    const result = await uc.execute(undefined as any);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
  });

  it("should throw InternalServerError", async () => {
    const repo = {
      getAll: jest.fn().mockRejectedValue(new Error("Some error")),
    };
    const uc = new GetAllTopicsUseCase(repo as any, loggerMock() as any) as any;
    await expect(uc.execute(undefined as any)).rejects.toMatchObject(
      new InternalServerError()
    );
  });
});
