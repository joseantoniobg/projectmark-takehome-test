export interface IPermissionStrategy {
  canCreate(): boolean;
  canEditAnyTopic(): boolean;
  canEditOwnTopic(): boolean;
  canView(): boolean;
}
