import {User} from "../entity/User/User";

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
