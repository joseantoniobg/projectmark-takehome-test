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
      const dto: GetTopicDto = {
        id: req.query?.id as string,
        version: Number(req.query?.version),
      };
      const topic = await this.topicService.getTopic(dto);
      res.status(200).json(topic);
    } catch (err: any) {
      res.status(err.statusCode).json({ error: err.message });
    }
  }

  async getWithChildren(req: Request, res: Response) {
    try {
      const id = req.query?.id as string;
      const topic = await this.topicService.getTopicWithChildren({ id });
      res.status(200).json(topic);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const topics = await this.topicService.getAll();
      res.status(200).json(topics);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const dto: TopicDto = req.body;

      const topic = await this.topicService.createTopic(dto);
      res.status(201).json(topic);
    } catch (err: any) {
      res.status(err.statusCode).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const dto: TopicDto = req.body;
      const topic = await this.topicService.updateTopic(id, dto);
      res.status(200).json(topic);
    } catch (err: any) {
      res.status(err.statusCode).json({ error: err.message });
    }
  }
}
