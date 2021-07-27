import {MaxLength} from "class-validator";
import {Field, ID, ObjectType} from "type-graphql";
import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";

@Entity()
@ObjectType()
@Unique("my_unique_constraint", ["email"])
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  @MaxLength(30)
  email: string;

  @Field(() => String, {nullable: true})
  @Column({nullable: true})
  tokenRefresh?: string;

  @Field(() => String)
  @Column()
  passwordHash: string;
}
