import { IPermissionStrategy } from "./permission.strategy";

export class AdminPermissionStrategy implements IPermissionStrategy {
  canCreate(): boolean {
    return true;
  }
  canEditAnyTopic(): boolean {
    return true;
  }
  canEditOwnTopic(): boolean {
    return true;
  }
  canView(): boolean {
    return true;
  }
}
