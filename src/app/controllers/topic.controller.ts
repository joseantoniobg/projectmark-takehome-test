import { Request, Response } from "express";
import { injectable } from "tsyringe";
import { TopicService } from "../services/topic.service";
import { TopicDto } from "../dto/topic.dto";
import { GetTopicDto } from "../dto/get-topic.dto";

@injectable()
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  async get(req: Request, res: Response) {
    try {
      const dto = (req as any).validatedQuery as GetTopicDto;
      const topic = await this.topicService.getTopic(dto);
      res.status(200).json(topic);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getWithChildren(req: Request, res: Response) {
    try {
      const dto = (req as any).validatedQuery as GetTopicDto;
      const topic = await this.topicService.getTopicWithChildren(dto);
      res.status(200).json(topic);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const dto: TopicDto = req.body;

      const topic = await this.topicService.createTopic(dto);
      res.status(201).json(topic);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const dto: TopicDto = req.body;
      const topic = await this.topicService.updateTopic(id, dto);
      res.status(200).json(topic);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
