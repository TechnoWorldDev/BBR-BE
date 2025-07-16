export class RoleResponse {
  id: string;
  name: string;
  description: string | null;
  permissions?: any[];

  constructor(role: any) {
    this.id = role.id;
    this.name = role.name;
    this.description = role.description || 'No description available';
    this.permissions = role.permissions || [];
  }
}
