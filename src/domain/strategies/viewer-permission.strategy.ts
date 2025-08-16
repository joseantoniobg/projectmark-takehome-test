import { IPermissionStrategy } from "./permission.strategy";

export class ViewerPermissionStrategy implements IPermissionStrategy {
  canCreate(): boolean {
    return false;
  }
  canEditAnyTopic(): boolean {
    return false;
  }
  canEditOwnTopic(): boolean {
    return false;
  }
  canView(): boolean {
    return true;
  }
}
