import {UserService} from "@root/services/UserService";
import {AuthChecker} from "type-graphql";
import {TContext} from "../interface/Context";

export const customAuthChecker: AuthChecker<TContext> = ({root, args, context, info}, params) => {
  if (context.user) {
    return true;
  }
  return false;
};
