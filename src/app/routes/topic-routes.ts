import { Router } from "express";
import { topicController } from "../container";

const router = Router();

router.get("/", topicController.get.bind(topicController));

router.get("/all", topicController.getAll.bind(topicController));

router.get("/children", topicController.getWithChildren.bind(topicController));

router.get(
  "/path",
  topicController.findShortestPathBetweenTwoTopics.bind(topicController)
);

router.post("/", topicController.create.bind(topicController));

router.patch("/:id", topicController.update.bind(topicController));

export default router;
