import { Injectable } from '@nestjs/common';
import { FileType } from './file-type.enum';

@Injectable()
export class FileUploadServiceConfiguration {
  private static readonly allowedMimeTypes: Map<FileType, string[]> = new Map();

  static {
    // Adding allowed MIME types for images
    FileUploadServiceConfiguration.allowedMimeTypes.set(FileType.IMAGE, [
      'image/avif',
      'image/bmp',
      'image/cgm',
      'image/g3fax',
      'image/gif',
      'image/heic',
      'image/ief',
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/prs.btif',
      'image/svg+xml',
      'image/tiff',
      'image/vnd.adobe.photoshop',
      'image/vnd.djvu',
      'image/vnd.dwg',
      'image/vnd.dxf',
      'image/vnd.fastbidsheet',
      'image/vnd.fpx',
      'image/vnd.fst',
      'image/vnd.fujixerox.edmics-mmr',
      'image/vnd.fujixerox.edmics-rlc',
      'image/vnd.mozilla.apng',
      'image/vnd.ms-modi',
      'image/vnd.net-fpx',
      'image/vnd.wap.wbmp',
      'image/vnd.xiff',
      'image/webp',
      'image/x-adobe-dng',
      'image/x-canon-cr2',
      'image/x-canon-crw',
      'image/x-cmu-raster',
      'image/x-cmx',
      'image/x-epson-erf',
      'image/x-freehand',
      'image/x-fuji-raf',
      'image/x-icns',
      'image/x-icon',
      'image/x-kodak-dcr',
      'image/x-kodak-k25',
      'image/x-kodak-kdc',
      'image/x-minolta-mrw',
      'image/x-nikon-nef',
      'image/x-olympus-orf',
      'image/x-panasonic-raw',
      'image/x-pcx',
      'image/x-pentax-pef',
      'image/x-pict',
      'image/x-png',
      'image/x-portable-anymap',
      'image/x-portable-bitmap',
      'image/x-portable-graymap',
      'image/x-portable-pixmap',
      'image/x-rgb',
      'image/x-sigma-x3f',
      'image/x-sony-arw',
      'image/x-sony-sr2',
      'image/x-sony-srf',
      'image/x-xbitmap',
      'image/x-xpixmap',
      'image/x-xwindowdump',
    ]);

    // Adding allowed MIME types for documents
    FileUploadServiceConfiguration.allowedMimeTypes.set(FileType.DOCUMENT, [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/pdf',
    ]);
  }

  getAllowedMimeTypesByFileType(fileType: FileType): string[] {
    return FileUploadServiceConfiguration.allowedMimeTypes.get(fileType) ?? [];
  }
}
