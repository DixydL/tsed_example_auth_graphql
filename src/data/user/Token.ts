import {Field, ObjectType} from "type-graphql";

@ObjectType()
export class Token {
  @Field(() => String)
  token: string;

  @Field()
  tokenExp: number;

  @Field(() => String)
  refreshToken: string;

  @Field()
  refreshTokenExp: number;

  constructor(token: string, refreshToken: string, tokenExp: number, refreshTokenExp: number) {
    this.token = token;
    this.refreshToken = refreshToken;
    this.tokenExp = tokenExp;
    this.refreshTokenExp = refreshTokenExp;
  }
}
