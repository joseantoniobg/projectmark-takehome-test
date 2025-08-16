import { Router } from "express";
import { topicController } from "../container";
import { validateDto } from "../middleware/body.middleware";
import { TopicDto } from "../dto/topic.dto";
import { validateQueryDto } from "../middleware/query.middleware";
import { GetTopicDto } from "../dto/get-topic.dto";

const router = Router();

router.get(
  "/",
  validateQueryDto(GetTopicDto),
  topicController.get.bind(topicController)
);

router.get(
  "/children",
  validateQueryDto(GetTopicDto),
  topicController.getWithChildren.bind(topicController)
);

router.post(
  "/",
  validateDto(TopicDto),
  topicController.create.bind(topicController)
);

router.patch(
  "/:id",
  validateDto(TopicDto),
  topicController.update.bind(topicController)
);

export default router;
