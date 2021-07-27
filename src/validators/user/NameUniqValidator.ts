import {UserService} from "@root/services/UserService";
import {Inject, Injectable} from "@tsed/di";
import {ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

@ValidatorConstraint({async: true})
@Injectable()
export class NameUniqValidator implements ValidatorConstraintInterface {
  @Inject(UserService)
  userService: UserService;

  validate(value: any) {
    return this.userService.findOne({name: value}).then((responce) => {
      if (responce) {
        return false;
      }
      return true;
    });
  }
}
