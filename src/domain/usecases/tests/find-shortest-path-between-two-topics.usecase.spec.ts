import { FindShortestPathBetweenTwoTopicsUseCase } from "../find-shortest-path-between-two-topics.usecase";
import { GetTopicUseCase } from "../get-topic.usecase";
import { loggerMock, makeTopic } from "../../tests/helpers";
import {
  ConflictError,
  ValidationError,
} from "../error-handling/mapped-errors";

describe("FindShortestPathBetweenTwoTopicsUseCase", () => {
  let repo: any;
  let getTopic: any;
  let logger: any;
  let uc: FindShortestPathBetweenTwoTopicsUseCase;

  const topology: Record<string, { parent?: string; children?: string[] }> = {
    "5d91acec-6d16-47b2-9f62-f1cd6f70be8f": {
      children: [
        "a52e05ce-063f-47b6-95d8-20763a5b2cb5",
        "eb7dde16-827b-49df-82e0-6eec643b6a23",
      ],
    },
    "a52e05ce-063f-47b6-95d8-20763a5b2cb5": {
      parent: "5d91acec-6d16-47b2-9f62-f1cd6f70be8f",
      children: ["2286573f-b849-45a5-892f-ca39fd81823d"],
    },
    "eb7dde16-827b-49df-82e0-6eec643b6a23": {
      parent: "5d91acec-6d16-47b2-9f62-f1cd6f70be8f",
      children: ["2286573f-b849-45a5-892f-ca39fd81823d"],
    },
    "2286573f-b849-45a5-892f-ca39fd81823d": {
      parent: "a52e05ce-063f-47b6-95d8-20763a5b2cb5",
      children: ["1c68a834-71f8-40a3-b934-10e826a96407"],
    },
    "1c68a834-71f8-40a3-b934-10e826a96407": {
      parent: "2286573f-b849-45a5-892f-ca39fd81823d",
      children: [],
    },
  };

  const makeNode = (id: string) => {
    const t = makeTopic({ id, name: id.toUpperCase(), version: 1 });
    const info = topology[id] || {};
    if (info.parent) {
      t.parentTopic = makeTopic({ id: info.parent });
    }
    t.children = (info.children || []).map((cid) => makeTopic({ id: cid }));
    return t;
  };

  beforeEach(() => {
    repo = {
      getWithParentAndCurrentChildren: jest.fn(async (id: string) =>
        makeNode(id)
      ),
    };
    getTopic = {
      execute: jest.fn(async ({ id }: any) => makeNode(id)),
    } as unknown as GetTopicUseCase;
    logger = loggerMock();
    uc = new FindShortestPathBetweenTwoTopicsUseCase(
      repo as any,
      getTopic as any,
      logger as any
    ) as any;
  });

  it("should validate uuids", async () => {
    await expect(
      uc.execute({
        startTopicId: "bad",
        endTopicId: "462f831f-e22d-43e6-baa1-b7d1d3742f0e",
      } as any)
    ).rejects.toMatchObject(new ValidationError("Invalid start topic id"));
    await expect(
      uc.execute({
        startTopicId: "3fec148b-f0dd-4cfc-a4ae-60b9e4720cc4",
        endTopicId: "bad",
      } as any)
    ).rejects.toMatchObject(new ValidationError("Invalid end topic id"));
  });

  it("should return the single element path when start === end", async () => {
    const id = "3fec148b-f0dd-4cfc-a4ae-60b9e4720cc4";
    getTopic.execute.mockResolvedValue(makeTopic({ id }));
    const result = await uc.execute({
      startTopicId: id,
      endTopicId: id,
    } as any);
    expect(result.length).toBe(1);
    expect(result.topics[0].id).toBe(id);
  });

  it("should find a path using parent/children relations", async () => {
    const result = await uc.execute({
      startTopicId: "5d91acec-6d16-47b2-9f62-f1cd6f70be8f" as any,
      endTopicId: "1c68a834-71f8-40a3-b934-10e826a96407" as any,
    } as any);
    expect(result.length).toBeGreaterThan(0);
    expect(result.topics[0].id).toBe("5d91acec-6d16-47b2-9f62-f1cd6f70be8f");
    expect(result.topics[result.topics.length - 1].id).toBe(
      "1c68a834-71f8-40a3-b934-10e826a96407"
    );
  });

  it("should throw ConflictError when no relationship exists", async () => {
    repo.getWithParentAndCurrentChildren = jest.fn(async (id: string) => {
      if (id === "dbc27b1d-18f9-481d-b10c-2a3eea9b101d")
        return makeTopic({
          id: "dbc27b1d-18f9-481d-b10c-2a3eea9b101d",
          children: [],
        });
      return makeNode(id);
    });

    await expect(
      uc.execute({
        startTopicId: "dbc27b1d-18f9-481d-b10c-2a3eea9b101d" as any,
        endTopicId: "5d91acec-6d16-47b2-9f62-f1cd6f70be8f" as any,
      } as any)
    ).rejects.toMatchObject(
      new ConflictError("Start and end topics do not relate to each other")
    );
  });
});
