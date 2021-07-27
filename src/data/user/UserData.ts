import {User} from "@root/entity/User/User";
import {MaxLength} from "class-validator";
import {Field, ID, ObjectType} from "type-graphql";

@ObjectType()
export class UserData {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  @MaxLength(30)
  email: string;

  tokenRefresh?: string;

  passwordHash: string;

  static loadFromEntity(user: User): UserData {
    const userData = new UserData();
    userData.id = user.id;
    userData.name = user.name;
    userData.email = user.email;
    userData.tokenRefresh = user.tokenRefresh;
    userData.passwordHash = user.passwordHash;

    return userData;
  }
}
