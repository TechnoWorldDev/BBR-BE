/**
 * Generic Command Handler Interface
 * @template C - Command Type
 * @template R - Return Type
 */
export interface ICommandHandler<C, R> {
  handle(command: C): Promise<R>;
}
