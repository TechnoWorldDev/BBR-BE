export interface IProcessJob {
  action: string;
  to: string;
  subject?: string;
  template?: string;
  variables?: Record<string, any>;
}
