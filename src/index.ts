import "reflect-metadata";
import express, { Express, Request, Response } from "express";
import { container } from "tsyringe";
import { UserTypeormRepository } from "./infra/typeorm/repositories/user-typeorm.repository";
import { IUserRepository } from "./domain/repositories/user.repository";
import { SqliteDataSource } from "./infra/typeorm/sqlite-data-source";
import userRoutes from "./app/routes/user-routes";
import topicRoutes from "./app/routes/topic-routes";
import logger from "./infra/logging/logger";

container.register<IUserRepository>("UserRepository", {
  useClass: UserTypeormRepository,
});

const port = process.env.PORT || 3000;

const app: Express = express();
app.use(express.json());

app.use("/users", userRoutes);
app.use("/topics", topicRoutes);

SqliteDataSource.initialize()
  .then(() => {
    logger.info("Database iniciated");
    app.listen(port, () => {
      logger.info(`[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    logger.error("Error during Data Source initialization:", err);
  });
