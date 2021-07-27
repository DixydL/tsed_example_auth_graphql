import {User} from "../entity/User/User";
import {EntityRepository, Repository} from "typeorm";
@EntityRepository(User)
export class UserRepository extends Repository<User> {}
