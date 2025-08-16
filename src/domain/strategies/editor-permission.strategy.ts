import { IPermissionStrategy } from "./permission.strategy";

export class EditorPermissionStrategy implements IPermissionStrategy {
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
