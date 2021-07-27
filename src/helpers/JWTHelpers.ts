import {User} from "@root/entity/User/User";
import * as jwt from "jsonwebtoken";
import { UserData } from "../data/user/UserData";

export class JWThelper {
  static async verifyToken(token: string): Promise<number> {
    return await new Promise(async (resolve, reject) => {
      jwt.verify(token, process.env.TOKEN_SECRET ?? "Secret", async (err: any, user: any) => {
        if (err) return reject(err.message);
        return resolve(user.sub);
      });
    });
  }

  static async verifyRefreshToken(token: string): Promise<number> {
    return await new Promise(async (resolve, reject) => {
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET ?? "SecretRefresh", async (err: any, user: any) => {
        if (err) return reject(err.message);
        return resolve(user.sub);
      });
    });
  }

  static createToken(user: UserData): [string, number] {
    const now = Date.now();
    let tokenExp = now + 60 * 60 * 30;

    return [
      jwt.sign(
        {
          sub: user.id,
          exp: tokenExp,
          iat: now
        },
        "Secret"
      ),
      tokenExp
    ];
  }

  static createTokenRefresh(user: UserData): [string, number] {
    const now = Date.now();
    let tokenRefreshExp = now + 60 * 60 * 60 * 10000;
    return [
      jwt.sign(
        {
          sub: user.id,
          exp: tokenRefreshExp,
          iat: now
        },
        "SecretRefresh"
      ),
      tokenRefreshExp
    ];
  }
}
