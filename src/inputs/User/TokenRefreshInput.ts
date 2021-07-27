import {InputType, Field} from "type-graphql";

@InputType()
export class TokenRefreshInput {
  @Field()
  refreshToken: string;
}
