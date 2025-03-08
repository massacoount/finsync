import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { AuthProvider } from "@finsync/shared";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  email?: string;

  @Column()
  password?: string;

  @Column()
  name?: string;

  @Column()
  picture?: string;

  @Column({ type: "enum", enum: AuthProvider })
  provider?: AuthProvider;
}
