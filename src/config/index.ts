import {join} from "path";
import { UserResolve } from "@root/resolves/UserResolve";
import {loggerConfig} from "./logger";
import typeormConfig from "./typeorm";

const {version} = require("../../package.json");
export const rootDir = join(__dirname, "..");

export const config: Partial<TsED.Configuration> = {
  version,
  rootDir,
  logger: loggerConfig,
  typeorm: typeormConfig,
  typegraphql: {
    default: {
      path: "/graphql",
      uploads: false,
      context: ({req}) => {
        const context = {
          req,
          user: req?.user
        };
        return context;
      },
      buildSchemaOptions: {
        resolvers: [UserResolve],
        //authChecker: customAuthChecker
      }
    }
  }
  // additional shared configuration
};
