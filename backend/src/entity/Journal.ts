import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { TransactionEntity } from "./Transaction";

@Entity()
export class JournalEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => TransactionEntity)
  transaction?: TransactionEntity;

  @Column()
  date?: Date;

  @Column("text")
  journalEntry?: string;
}
