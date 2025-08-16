import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  TreeChildren,
  TreeParent,
} from "typeorm";
import { Resource } from "./resource.entity";
import { User } from "./user.entity";

@Entity("topic")
@Index(["stack", "version"], { unique: true })
export class Topic {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  stack: string;

  @Column({ type: "int" })
  version: number;

  @Column({ type: "varchar", length: 200 })
  name: string;

  @Column({ type: "text" })
  content: string;

  @Column({ name: "parent_topic_id", type: "uuid", nullable: true })
  parentTopicId?: string;

  @TreeParent()
  @ManyToOne(() => Topic, (topic) => topic.children, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "parent_topic_id", referencedColumnName: "id" })
  parentTopic: Topic | null;

  @Column({ name: "user_id", type: "uuid" })
  userId: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;

  @TreeChildren()
  @OneToMany(() => Topic, (topic) => topic.parentTopic)
  children: Topic[];

  @OneToMany(() => Resource, (resource) => resource.topic, { cascade: true })
  resources: Resource[];

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "updated_at" })
  updatedAt: Date;
}
