import { Router } from "express";
import { userController } from "../container";

const router = Router();

router.post("/", userController.create.bind(userController));

export default router;
