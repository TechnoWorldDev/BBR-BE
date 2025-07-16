export class AssignPermissionCommand {
  constructor(
    public readonly roleId: string,
    public readonly permissionId: string
  ) {}
}
