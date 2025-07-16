import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  HttpCode,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadMediaCommandHandler } from '../application/handler/upload-media.command.handler';
import { MediaCollectionType } from '../domain/media-collection-type.enum';
import { UploadMediaResponse } from './response/upload-media.response';
import { UploadMediaCommand } from '../application/command/upload-media.command';
import { FetchContentCommandHandler } from '../application/handler/fetch-content.command.handler';
import { MediaStatusResponse } from './response/media-status.response';
import { FindMediaUploadStatusByIdCommandQuery } from '../application/query/find-media-status-by-id.command.query';
import { FindMediaByIdCommandQuery } from '../application/query/find-media-by-id.command.query';
import { MediaResponse } from './response/media.response';
import { Response } from 'express';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(
    private readonly uploadMediaCommandHandler: UploadMediaCommandHandler,
    private readonly fetchContentCommandHandler: FetchContentCommandHandler,
    private readonly findMediaUploadStatusByIdCommandQuery: FindMediaUploadStatusByIdCommandQuery,
    private readonly findMediaByIdCommandQuery: FindMediaByIdCommandQuery
  ) {}

  @ApiOperation({ summary: 'Upload media' })
  @Post()
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(
    @Query('type') collectionType: MediaCollectionType,
    @UploadedFile() file: Express.Multer.File
  ): Promise<UploadMediaResponse> {
    const command = new UploadMediaCommand(file, collectionType);
    const result = await this.uploadMediaCommandHandler.handle(command);

    return new UploadMediaResponse(result.id);
  }

  @ApiOperation({ summary: 'Get Media content by ID' })
  @Get('/:id/content')
  @HttpCode(200)
  async getContentById(@Param('id') id: string, @Res() res: Response) {
    const result = await this.fetchContentCommandHandler.handle(id);

    res.setHeader('Content-Type', result.media.mimeType);
    res.send(result.content);
  }

  @ApiOperation({ summary: 'Get Media upload status by ID' })
  @Get('/:id/status')
  async getUploadStatusById(@Param('id') id: string): Promise<MediaStatusResponse> {
    const result = await this.findMediaUploadStatusByIdCommandQuery.handle(id);

    return new MediaStatusResponse(result.status);
  }

  @ApiOperation({ summary: 'Get Media information by ID' })
  @Get('/:id')
  async getMediaById(@Param('id') id: string): Promise<MediaResponse> {
    const result = await this.findMediaByIdCommandQuery.handle(id);

    return new MediaResponse(
      result.id,
      result.originalFileName,
      result.mimeType,
      result.uploadStatus,
      result.size,
      result.securedUrl
    );
  }
}
