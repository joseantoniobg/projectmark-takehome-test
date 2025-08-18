import { Topic } from "../entities/topic";
import { validateUuid } from "../helpers/functions.helpers";
import { ILogger } from "../logging/logger";
import { IFindTopicsPathModel } from "../models/find-topics-path.model";
import { IPathTopicsModel } from "../models/path-topics.model";
import { ITopicRepository } from "../repositories/topic.repository";
import { UseCase } from "./abstract/use-case";
import { ConflictError, ValidationError } from "./error-handling/mapped-errors";
import { GetTopicUseCase } from "./get-topic.usecase";

export class FindShortestPathBetweenTwoTopicsUseCase extends UseCase<
  IFindTopicsPathModel,
  IPathTopicsModel
> {
  constructor(
    private readonly topicRepository: ITopicRepository,
    private readonly getTopicUseCase: GetTopicUseCase,
    logger: ILogger
  ) {
    super("FindShortestPathBetweenTwoTopics", logger);
  }

  async perform(topicsTofind: IFindTopicsPathModel): Promise<IPathTopicsModel> {
    const { startTopicId, endTopicId } = topicsTofind;

    if (!validateUuid(startTopicId)) {
      throw new ValidationError("Invalid start topic id");
    }

    if (!validateUuid(endTopicId)) {
      throw new ValidationError("Invalid end topic id");
    }

    const startTopic = await this.getTopicUseCase.execute({ id: startTopicId });

    if (startTopicId === endTopicId) {
      return {
        length: 1,
        topics: [
          {
            id: startTopic.id,
            name: startTopic.name,
            version: startTopic.version,
          },
        ],
      };
    }

    const endTopic = await this.getTopicUseCase.execute({ id: endTopicId });

    const queue: Topic[] = [];
    const visited = new Set<string>();
    const predecessor = new Map<string, Topic>();

    const startNode =
      await this.topicRepository.getWithParentAndCurrentChildren(startTopicId);

    queue.push(startNode);
    visited.add(startNode.id);

    let pathFound = false;

    while (queue.length > 0) {
      const currentNode = queue.shift()!;

      if (currentNode.id === endTopicId) {
        pathFound = true;
        break;
      }

      const nodeWithRelations =
        currentNode.id === startTopicId
          ? startNode
          : await this.topicRepository.getWithParentAndCurrentChildren(
              currentNode.id
            );

      const neighbors: Topic[] = [];
      if (nodeWithRelations?.parentTopic) {
        neighbors.push(nodeWithRelations.parentTopic);
      }
      if (nodeWithRelations?.children.length > 0) {
        neighbors.push(...nodeWithRelations.children);
      }

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.id)) {
          visited.add(neighbor.id);
          predecessor.set(neighbor.id, currentNode);
          queue.push(neighbor);
        }
      }
    }

    if (!pathFound) {
      throw new ConflictError(
        "Start and end topics do not relate to each other"
      );
    }

    const path: Topic[] = [];
    let currentId = endTopicId;

    while (currentId !== startTopicId) {
      const topicInPath =
        currentId === endTopicId
          ? endTopic
          : await this.getTopicUseCase.execute({ id: currentId });

      path.unshift(topicInPath);

      const pred = predecessor.get(currentId)!;
      currentId = pred.id;
    }
    path.unshift(startNode);

    return {
      length: path.length,
      topics: path.map((topic: Topic) => ({
        id: topic.id,
        name: topic.name,
        version: topic.version,
      })),
    };
  }
}
