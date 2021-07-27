import {UserService} from "@root/services/UserService";
import * as jwt from "jsonwebtoken";
import {Unauthorized} from "@tsed/exceptions";
import {User} from "@root/entity/User/User";
import {Middleware, Next, Req} from "@tsed/common";

@Middleware()
export class JWTMidlleware {
  constructor(private userService: UserService) {}

  async use(@Req() req: Req, @Next() next: Next): Promise<void> {
    if (req.headers) {
      const authHeader = req.headers["authorization"];
      if (authHeader) {
        const token = authHeader && authHeader.split(" ")[1];
        if (token == null) throw new Unauthorized("Token not found");

        const user: User = await new Promise(async (resolve, reject) => {
          jwt.verify(token, process.env.TOKEN_SECRET ?? "Secret", async (err: any, user: any) => {
            if (err) return reject(err.message);
            user = await this.userService.findOne(user.sub);

            return resolve(user);
          });
        });
        req.user = user;
      }
    }

    return next();
  }
}
