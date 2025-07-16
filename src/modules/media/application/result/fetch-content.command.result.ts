import { Media } from '../../domain/media.entity';

export class FetchContentCommandResult {
  constructor(
    public readonly media: Media,
    public readonly content: Buffer
  ) {}
}
