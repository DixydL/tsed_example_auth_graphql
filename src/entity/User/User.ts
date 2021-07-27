import {MaxLength} from "class-validator";
import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm";

@Entity()
@Unique("my_unique_constraint", ["email"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @MaxLength(30)
  email: string;

  @Column({nullable: true})
  tokenRefresh?: string;

  @Column()
  passwordHash: string;
}
