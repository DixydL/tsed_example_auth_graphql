import {Inject} from "@tsed/di";
import {ResolverService} from "@tsed/graphql";
import {UserService} from "@root/services/UserService";
import {Arg, Authorized, Ctx, Mutation, Query, registerEnumType, UseMiddleware} from "type-graphql";
import {User} from "@root/entity/User/User";
import {UserInput} from "@root/inputs/User/UserInput";
import {UserLoginInput} from "@root/inputs/User/UserLoginInput";
import {Token} from "@root/data/user/Token"
import {JWTMidlleware} from "@root/midlleware/JWTMidlleware";
import {TContext} from "@root/interface/Context";
import {JWThelper} from "@root/helpers/JWTHelpers";
import {AuthenticationError} from "apollo-server-express";
import {TokenRefreshInput} from "@root/inputs/User/TokenRefreshInput";
import {UserData} from "@root/data/user/UserData";
import {boolean, number} from "@tsed/schema";
import {ThemeInput} from "@root/inputs/User/ThemeInput";
import {UserWithTokenData} from "../../data/user/UserWithTokenData";

@ResolverService(User)
export class UserResolve {
  @Inject(UserService)
  private userService: UserService;

  @Query((returns) => [User])
  async users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Authorized()
  @Query((returns) => UserData)
  async userProfile(@Ctx() ctx: TContext) {
    const user = await this.userService.findById(ctx.user!.id);

    return user;
  }

  @Mutation(() => UserWithTokenData)
  async registartionUser(@Arg("data") userInput: UserInput) {
    let user = await this.userService.create(userInput);
    return {
      userData: UserData.loadFromEntity(user),
      tokenData: this.userService.createNewToken(user)
    };
  }

  @Mutation(() => UserWithTokenData)
  async loginUser(@Arg("data") userLoginInput: UserLoginInput) {
    let user = await this.userService.validateUser(userLoginInput);

    if (!user) {
      throw new AuthenticationError("Wrong credentials");
    }

    return {
      userData: UserData.loadFromEntity(user),
      tokenData: this.userService.createNewToken(user)
    };
  }

  @Mutation(() => Token)
  async refreshToken(@Arg("tokenRefresh") tokenRefresh: string) {
    let user = await this.userService.validateRefreshToken(tokenRefresh);

    if (!user) {
      throw new AuthenticationError("Wrong refresh token");
    }

    return this.userService.createNewToken(user);
  }
}
