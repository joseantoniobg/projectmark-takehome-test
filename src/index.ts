import "reflect-metadata";
import express, { Express, Request, Response } from "express";
import { container } from "tsyringe";
import { validateDto } from "./app/middleware/body.middleware";
import { UserTypeormRepository } from "./infra/typeorm/repositories/user-typeorm.repository";
import { UserRepository } from "./domain/repositories/user.repository";
import { UserController } from "./app/controllers/user.controller";
import { CreateUserDto } from "./app/dto/create-user.dto";
import { SqliteDataSource } from "./infra/typeorm/sqlite-data-source";
import userRoutes from "./app/routes/user-routes";
import topicRoutes from "./app/routes/topic-routes";

container.register<UserRepository>("UserRepository", {
  useClass: UserTypeormRepository,
});

const port = process.env.PORT || 3000;

const app: Express = express();
app.use(express.json());

app.use("/users", userRoutes);
app.use("/topics", topicRoutes);

SqliteDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
