export interface PermissionStrategy {
  canCreate(): boolean;
  canEditAnyTopic(): boolean;
  canEditOwnTopic(): boolean;
  canView(): boolean;
}
