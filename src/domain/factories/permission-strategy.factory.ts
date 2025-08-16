import { RoleEnum } from "../enums/role.enum";
import { AdminPermissionStrategy } from "../strategies/admin-permission.strategy";
import { EditorPermissionStrategy } from "../strategies/editor-permission.strategy";
import { IPermissionStrategy } from "../strategies/permission.strategy";
import { ViewerPermissionStrategy } from "../strategies/viewer-permission.strategy";
import { NotFoundError } from "../usecases/error-handling/mapped-errors";

export class PermissionStrategyFactory {
  static create(role: RoleEnum): IPermissionStrategy {
    switch (role) {
      case RoleEnum.ADMIN:
        return new AdminPermissionStrategy();
      case RoleEnum.EDITOR:
        return new EditorPermissionStrategy();
      case RoleEnum.VIEWER:
        return new ViewerPermissionStrategy();
      default:
        throw new NotFoundError(`Role not found: ${role}`);
    }
  }
}
