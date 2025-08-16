import { PermissionStrategy } from "./permission.strategy";

export class EditorPermissionStrategy implements PermissionStrategy {
  canCreate(): boolean {
    return true;
  }
  canEditAnyTopic(): boolean {
    return false;
  }
  canEditOwnTopic(): boolean {
    return true;
  }
  canView(): boolean {
    return true;
  }
}
