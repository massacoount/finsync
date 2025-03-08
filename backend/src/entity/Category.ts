import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @Column({ type: "enum", enum: ["income", "expense"] })
  type?: "income" | "expense";

  @Column("text")
  notes?: string;
}
