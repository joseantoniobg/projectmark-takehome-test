import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/user.entity"; // We'll create this next
import { Topic } from "./entities/topic.entity";
import { Resource } from "./entities/resource.entity";

export const SqliteDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [User, Topic, Resource],
  migrations: [],
  subscribers: [],
});
