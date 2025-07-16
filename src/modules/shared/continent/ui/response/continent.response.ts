export class ContinentResponse {
  id: string;
  name: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(id: string, name: string, code: string, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
