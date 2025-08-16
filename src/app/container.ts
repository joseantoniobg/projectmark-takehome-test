import { CreateTopicUseCase } from "../domain/usecases/create-topic.usecase";
import { CreateUserUseCase } from "../domain/usecases/create-user.usecase";
import { GetTopicWithChildrenUseCase } from "../domain/usecases/get-topic-with-children.usecase";
import { GetTopicUseCase } from "../domain/usecases/get-topic.usecase";
import { UpdateTopicUseCase } from "../domain/usecases/update-topic.usecase";
import { TopicTypeormRepository } from "../infra/typeorm/repositories/topic-typeorm.repository";
import { UserTypeormRepository } from "../infra/typeorm/repositories/user-typeorm.repository";
import { TopicController } from "./controllers/topic.controller";
import { UserController } from "./controllers/user.controller";
import { TopicService } from "./services/topic.service";
import { UserService } from "./services/user.service";

const userRepository = new UserTypeormRepository();
const createUserUseCase = new CreateUserUseCase(userRepository);
const userService = new UserService(createUserUseCase);
const userController = new UserController(userService);

const topicRepository = new TopicTypeormRepository();
const createTopicUseCase = new CreateTopicUseCase(
  topicRepository,
  userRepository
);
const updateTopicUseCase = new UpdateTopicUseCase(
  userRepository,
  topicRepository,
  createTopicUseCase
);
const getTopicUseCase = new GetTopicUseCase(topicRepository);
const getTopicWithChildrenUseCase = new GetTopicWithChildrenUseCase(
  topicRepository,
  getTopicUseCase
);
const topicService = new TopicService(
  createTopicUseCase,
  updateTopicUseCase,
  getTopicUseCase,
  getTopicWithChildrenUseCase
);
const topicController = new TopicController(topicService);

export { userController, topicController };
