import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { UserEntity } from "./User";
import { CategoryEntity } from "./Category";

@Entity()
export class BudgetTargetEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => UserEntity)
  user?: UserEntity;

  @ManyToOne(() => CategoryEntity)
  category?: CategoryEntity;

  @Column("decimal", { precision: 10, scale: 2 })
  amount?: number;

  @Column()
  startDate?: Date;

  @Column()
  endDate?: Date;
}
