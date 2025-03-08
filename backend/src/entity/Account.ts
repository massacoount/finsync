import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  userId?: number;

  @Column()
  name?: string;

  @Column()
  type?: string;

  @Column()
  balance?: number;

  @Column()
  currency?: string;
}
