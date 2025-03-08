import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { UserEntity } from "./User";
import { CategoryEntity } from "./Category";

@Entity()
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => UserEntity)
  user?: UserEntity;

  @ManyToOne(() => CategoryEntity)
  category?: CategoryEntity;

  @Column()
  date?: Date;

  @Column("decimal", { precision: 10, scale: 2 })
  amount?: number;

  @Column("text")
  description?: string;

  @Column()
  accountFrom?: string;

  @Column()
  accountTo?: string;
}
