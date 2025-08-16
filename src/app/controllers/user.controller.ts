import { Request, Response } from "express";
import { injectable } from "tsyringe";
import { UserService } from "../services/user.service";
import { CreateUserDto } from "../dto/create-user.dto";

@injectable()
export class UserController {
  constructor(private userService: UserService) {}

  async create(req: Request, res: Response) {
    try {
      const dto: CreateUserDto = req.body;

      const user = await this.userService.createUser(dto);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
