import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { RoleEnum } from "../../../domain/enums/role.enum";

@Entity("user")
export class User {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 100, unique: true })
  email: string;

  @Column({ type: "varchar", enum: RoleEnum, length: 20 })
  role: RoleEnum;

  @Column({ name: "created_at" })
  createdAt: Date;
}
