import { PermissionStrategy } from "./permission.strategy";

export class ViewerPermissionStrategy implements PermissionStrategy {
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
