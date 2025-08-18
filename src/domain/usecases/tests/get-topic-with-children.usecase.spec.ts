import { GetTopicWithChildrenUseCase } from "../get-topic-with-children.usecase";
import { GetTopicUseCase } from "../get-topic.usecase";
import { loggerMock, makeTopic } from "../../tests/helpers";
import {
  InternalServerError,
  ValidationError,
} from "../error-handling/mapped-errors";

describe("GetTopicWithChildrenUseCase", () => {
  let repo: any;
  let getTopic: any;
  let logger: any;
  let usecase: GetTopicWithChildrenUseCase;

  beforeEach(() => {
    repo = { getCurrentChildren: jest.fn() };
    getTopic = { execute: jest.fn() } as unknown as GetTopicUseCase;
    logger = loggerMock();
    usecase = new GetTopicWithChildrenUseCase(repo, getTopic, logger) as any;
  });

  it("validates id", async () => {
    await expect(usecase.execute("" as any)).rejects.toMatchObject(
      new ValidationError("Id must be informed")
    );
  });

  it("returns a nested tree", async () => {
    const root = makeTopic({ id: "a3c49c7c-8243-4445-a6e1-c2fa8980fdf7" });
    const childA = makeTopic({ id: "c34890f2-e346-43f6-ae55-b39c30220434" });
    const childB = makeTopic({ id: "6dd624cd-fb2d-4880-ac80-fdf203dbc14f" });
    const grand = makeTopic({ id: "5f5178f5-414d-42a4-a90e-1b0203ad35d4" });

    getTopic.execute.mockResolvedValue(root);
    repo.getCurrentChildren.mockImplementation(async (id: string) => {
      if (id === root.id) return [childA, childB];
      if (id === childA.id) return [grand];
      return [];
    });

    const result = await usecase.execute(root.id);

    expect(result.id).toBe(root.id);
    expect(result.children.map((c: any) => c.id)).toEqual([
      childA.id,
      childB.id,
    ]);
    expect(result.children[0].children[0].id).toBe(grand.id);
  });

  it("should throw a InternalServerError when something unexpected goes wrong", async () => {
    const root = makeTopic({ id: "a3c49c7c-8243-4445-a6e1-c2fa8980fdf7" });
    getTopic.execute.mockResolvedValue(root);
    repo.getCurrentChildren.mockRejectedValue(new Error("boom"));
    await expect(usecase.execute(root.id)).rejects.toMatchObject(
      new InternalServerError()
    );
  });
});
