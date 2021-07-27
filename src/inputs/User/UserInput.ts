import {EmailUniqValidator} from "@root/validators/user/EmailUniqValidator";
import {NameUniqValidator} from "@root/validators/user/NameUniqValidator";
import {IsEmail, Validate} from "class-validator";
import {InputType, Field} from "type-graphql";

@InputType()
export class UserInput {
  @Field()
  @Validate(NameUniqValidator, {message: "Нікнейм уже зайнятий"})
  name: string;

  @Field()
  @IsEmail()
  @Validate(EmailUniqValidator, {message: "Емейл уже зайнятий"})
  email: string;

  @Field()
  password: string;
}
