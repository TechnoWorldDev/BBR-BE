export class MediaFolder<F> {
  private readonly folder: F;

  private constructor(folder: F) {
    this.folder = folder;
  }

  static of<F>(folder: F): MediaFolder<F> {
    return new MediaFolder(folder);
  }

  getFolder(): F {
    return this.folder;
  }
}
