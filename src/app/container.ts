import { CreateTopicUseCase } from "../domain/usecases/create-topic.usecase";
import { CreateUserUseCase } from "../domain/usecases/create-user.usecase";
import { GetAllTopicsUseCase } from "../domain/usecases/get-all-topics.usecase";
import { GetTopicWithChildrenUseCase } from "../domain/usecases/get-topic-with-children.usecase";
import { GetTopicUseCase } from "../domain/usecases/get-topic.usecase";
import { UpdateTopicUseCase } from "../domain/usecases/update-topic.usecase";
import { TopicTypeormRepository } from "../infra/typeorm/repositories/topic-typeorm.repository";
import { UserTypeormRepository } from "../infra/typeorm/repositories/user-typeorm.repository";
import { TopicController } from "./controllers/topic.controller";
import { UserController } from "./controllers/user.controller";
import { TopicService } from "./services/topic.service";
import { UserService } from "./services/user.service";
import logger from "../infra/logging";
import { FindShortestPathBetweenTwoTopicsUseCase } from "../domain/usecases/find-shortest-path-between-two-topics.usecase";

const userRepository = new UserTypeormRepository();
const createUserUseCase = new CreateUserUseCase(userRepository, logger);
const userService = new UserService(createUserUseCase);
const userController = new UserController(userService);

const topicRepository = new TopicTypeormRepository();
const getTopicUseCase = new GetTopicUseCase(topicRepository, logger);
const getAllTopicsUseCase = new GetAllTopicsUseCase(topicRepository, logger);

const createTopicUseCase = new CreateTopicUseCase(
  topicRepository,
  userRepository,
  getTopicUseCase,
  logger
);

const updateTopicUseCase = new UpdateTopicUseCase(
  userRepository,
  topicRepository,
  createTopicUseCase,
  getTopicUseCase,
  logger
);

const getTopicWithChildrenUseCase = new GetTopicWithChildrenUseCase(
  topicRepository,
  getTopicUseCase,
  logger
);

const findShortestPathBetweenTwoTopicsUseCase =
  new FindShortestPathBetweenTwoTopicsUseCase(
    topicRepository,
    getTopicUseCase,
    logger
  );

const topicService = new TopicService(
  createTopicUseCase,
  updateTopicUseCase,
  getTopicUseCase,
  getTopicWithChildrenUseCase,
  getAllTopicsUseCase,
  findShortestPathBetweenTwoTopicsUseCase
);

const topicController = new TopicController(topicService);

export { userController, topicController };
