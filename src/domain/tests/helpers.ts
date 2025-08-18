import { Resource } from "../../infra/typeorm/entities/resource.entity";
import { Topic } from "../entities/topic";
import { User } from "../entities/user";
import { RoleEnum } from "../enums/role.enum";

export const loggerMock = () => ({
  info: jest.fn(),
  error: jest.fn(),
  exception: jest.fn(),
});

export const makeUser = (over: Partial<User> = {}) => ({
  id: "1ee136bf-1842-489d-bf89-8143d46c931f",
  name: "User",
  email: "user@test.com",
  role: RoleEnum.ADMIN,
  ...over,
});

export const makeResource = (over: Partial<Resource> = {}) => ({
  id: "e374bf9b-316e-473b-bb17-0d55008c503c",
  url: "https://example.com",
  description: "desc",
  type: "Article",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...over,
});

export const makeTopic = (over: Partial<Topic> = {}) => {
  const id = "7f19a8be-dc65-4c23-94d1-c4b839d90d10";
  const stack = over.stack ?? id;
  return {
    id,
    name: "Topic",
    content: "Body",
    createdAt: new Date(),
    updatedAt: new Date(),
    stack,
    version: 1,
    resources: [],
    userId: "1ee136bf-1842-489d-bf89-8143d46c931f",
    parentTopicId: null as string | null,
    children: [] as any[],
    ...over,
  };
};
