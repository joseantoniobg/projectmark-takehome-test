import { PermissionStrategy } from "./permission.strategy";

export class AdminPermissionStrategy implements PermissionStrategy {
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
