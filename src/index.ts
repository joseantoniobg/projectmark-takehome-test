import "reflect-metadata";
import express, { Express } from "express";
import { SqliteDataSource } from "./infra/typeorm/sqlite-data-source";
import userRoutes from "./app/routes/user-routes";
import topicRoutes from "./app/routes/topic-routes";
import logger from "./infra/logging/index";
import { requestLogger } from "./app/middleware/log.middleware";

const port = process.env.PORT || 3000;

const app: Express = express();
app.use(express.json());

app.use(requestLogger);

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
