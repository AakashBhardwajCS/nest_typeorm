
import { BadRequestException, Controller, Get, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectDisk, serveFile, StorageDisk, uploadToDisk, type StoredUpload } from '@nestjs/storage';
import type { Request, Response } from 'express';
import { MAX_PHOTO_SIZE, PHOTO_CACHE_CONTROL, PHOTO_TYPES } from './photo-rules.js';
import { PhotosService } from './photos.service.js';

@Controller()
export class PhotosController {

  constructor(
    private readonly photosService: PhotosService,
    @InjectDisk('photos') private readonly photos: StorageDisk,
  ) {}

  @Post('products/:id/photo')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: uploadToDisk({ disk: 'photos', contentTypes: PHOTO_TYPES, cacheControl: PHOTO_CACHE_CONTROL }),
      limits: { fileSize: MAX_PHOTO_SIZE, files: 1 },
    }),
  )
  upload(@Param('id') id: string, @UploadedFile() file: StoredUpload | undefined) {
    if (!file) {
      throw new BadRequestException('Attach the image to proceed');
    }
    return this.photosService.replace(id, file.key);
  }

  @Get('photos/:file')
  serve(@Param('file') file: string, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return serveFile(this.photos, file, { req, res, disposition: 'inline' });
  }
}
