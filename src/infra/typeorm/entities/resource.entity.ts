import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { ResourceTypeEnum } from "../../../domain/enums/resource-type.enum";
import { Topic } from "./topic.entity";

@Entity("resource")
export class Resource {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ name: "topic_id", type: "uuid" })
  topicId: string;

  @ManyToOne(() => Topic, (topic) => topic.resources)
  @JoinColumn({ name: "topic_id", referencedColumnName: "id" })
  topic?: Topic;

  @Column({ type: "text" })
  url: string;

  @Column({ type: "varchar", length: 100 })
  description: string;

  @Column({ type: "varchar", enum: ResourceTypeEnum, length: 20 })
  type: ResourceTypeEnum;

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "updated_at" })
  updatedAt: Date;
}
