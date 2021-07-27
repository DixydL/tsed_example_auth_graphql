import { User } from "@root/entity/User/User";
import { Req, Res } from "@tsed/common";

export class TContext {
    req: any;
    res: Res;
    user?: User;
}