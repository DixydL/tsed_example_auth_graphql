import {Inject, Service} from "@tsed/common";
import {UseConnection} from "@tsed/typeorm";
import {User} from "@root/entity/User/User";
import {UserInput} from "../inputs/User/UserInput";
import {UserLoginInput} from "../inputs/User/UserLoginInput";
import {UserRepository} from "@root/repositories/UserRepository";
import {Passwordhelper} from "@root/helpers/PasswordHelper";
import {FindConditions, FindOneOptions} from "typeorm";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";
import {JWThelper} from "@root/helpers/JWTHelpers";
import {UserData} from "../data/user/UserData";
import {NotFound} from "@tsed/exceptions";
import {Token} from "@root/data/user/Token";

@Service()
export class UserService {
  @Inject()
  @UseConnection("default")
  userRepository: UserRepository;

  async validateUser(userLoginInput: UserLoginInput): Promise<User | null> {
    const user = await this.userRepository.findOne({email: userLoginInput.email});
    if (user && (await Passwordhelper.checkPassword(userLoginInput.password, user.passwordHash))) {
      return user;
    }
    return null;
  }

  async validateRefreshToken(tokenRefresh: string): Promise<UserData | null> {
    const userId = await JWThelper.verifyRefreshToken(tokenRefresh);
    const user = await this.findById(userId);

    if (user && user.tokenRefresh === tokenRefresh) {
      return user;
    }

    return null;
  }

  async createNewToken(user: UserData): Promise<Token> {
    const [tokenRefresh, tokenRefreshExp] = JWThelper.createTokenRefresh(user);
    const [token, tokenExp] = JWThelper.createToken(user);
    await this.updateById({id: user.id}, {tokenRefresh});

    return new Token(token, tokenRefresh, tokenExp, tokenRefreshExp);
  }

  async updateById(condition: FindConditions<User>, update: QueryDeepPartialEntity<User>) {
    return this.userRepository.update(condition, update);
  }

  async create(userInput: UserInput) {
    const user = new User();
    user.email = userInput.email;
    user.name = userInput.name;
    user.name = userInput.name;
    user.passwordHash = await Passwordhelper.createHash(userInput.password);
    return this.userRepository.save(user);
  }

  async findById(userId: number) {
    const user = await this.userRepository.findOne({id: userId});

    if (user === undefined) {
      throw new NotFound("user not found");
    }

    return UserData.loadFromEntity(user);
  }

  async findOne(userInputLogin: UserLoginInput | any, options?: FindOneOptions<User>): Promise<User | undefined> {
    return await this.userRepository.findOne(userInputLogin, options);
  }

  async findAll() {
    return this.userRepository.find();
  }
}
