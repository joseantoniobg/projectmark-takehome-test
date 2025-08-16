import { Router } from "express";
import { userController } from "../container";
import { validateDto } from "../middleware/body.middleware";
import { CreateUserDto } from "../dto/create-user.dto";

const router = Router();

router.post(
  "/",
  validateDto(CreateUserDto),
  userController.create.bind(userController)
);

export default router;
