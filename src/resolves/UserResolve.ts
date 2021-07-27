import {Inject} from "@tsed/di";
import {ResolverService} from "@tsed/graphql";
import {UserService} from "@root/services/UserService";
import {Arg, Authorized, Ctx, Mutation, Query} from "type-graphql";
import {User} from "@root/entity/User/User";
import {UserInput} from "@root/inputs/User/UserInput";
import {UserLoginInput} from "@root/inputs/User/UserLoginInput";
import {Token} from "@root/data/user/Token";
import {TContext} from "@root/interface/Context";
import {AuthenticationError} from "apollo-server-express";
import {UserData} from "@root/data/user/UserData";
import {UserWithTokenData} from "@root/data/user/UserWithTokenData";

@ResolverService()
export class UserResolve {
  @Inject(UserService)
  private userService: UserService;

  @Query(() => [UserData])
  async users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Authorized()
  @Query(() => UserData)
  async userProfile(@Ctx() ctx: TContext): Promise<UserData> {
    const user = await this.userService.findById(ctx.user!.id);

    return user;
  }

  @Mutation(() => UserWithTokenData)
  async registartionUser(@Arg("data") userInput: UserInput): Promise<UserWithTokenData> {
    const user = await this.userService.create(userInput);
    return {
      userData: UserData.loadFromEntity(user),
      tokenData: await this.userService.createNewToken(user)
    };
  }

  @Mutation(() => UserWithTokenData)
  async loginUser(@Arg("data") userLoginInput: UserLoginInput): Promise<UserWithTokenData> {
    const user = await this.userService.validateUser(userLoginInput);

    if (!user) {
      throw new AuthenticationError("Wrong credentials");
    }

    return {
      userData: UserData.loadFromEntity(user),
      tokenData: await this.userService.createNewToken(user)
    };
  }

  @Mutation(() => Token)
  async refreshToken(@Arg("tokenRefresh") tokenRefresh: string): Promise<Token> {
    const user = await this.userService.validateRefreshToken(tokenRefresh);

    if (!user) {
      throw new AuthenticationError("Wrong refresh token");
    }

    return this.userService.createNewToken(user);
  }
}
