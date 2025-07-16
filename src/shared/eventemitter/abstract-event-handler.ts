export abstract class IEventHandler<E> {
  abstract handle(event: E): void;
}
