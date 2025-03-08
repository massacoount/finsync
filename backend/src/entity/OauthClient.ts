import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class OAuthClientEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  clientId?: string;

  @Column()
  clientSecret?: string;

  @Column()
  name?: string;

  @Column()
  createdAt?: Date;
}
