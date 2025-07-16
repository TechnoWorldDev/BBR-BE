import { FileType } from './file-type.enum';
import { SizeConfiguration } from './size.configuration';

export class DocumentSizeConfiguration extends SizeConfiguration {
  constructor() {
    // Set file type to DOCUMENT and size limit to 10MB
    super(FileType.DOCUMENT, 10485760);
  }
}
