import { Controller, Get, Req, Res } from '@nestjs/common';
import { serveSignedUrl, StorageDisk } from '@nestjs/storage';
import type { Request, Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly storageDisk: StorageDisk) {}

  @Get()
  download(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return serveSignedUrl(this.storageDisk, { req, res });
  }
}
