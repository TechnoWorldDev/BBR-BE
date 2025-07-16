import { FileType } from './file-type.enum';
import { SizeConfiguration } from './size.configuration';

export class ImageSizeConfiguration extends SizeConfiguration {
  constructor() {
    // 2MB in bytes
    super(FileType.IMAGE, 2097152);
  }
}
