import { randomUUID } from 'node:crypto';
import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadToDisk, type StoredUpload } from '@nestjs/storage';
import { detectPriceList } from './price-list.js';
import { PriceListsService } from './price-lists.service.js';

@Controller()
export class PriceListsController {
  constructor(private readonly priceListsService: PriceListsService) {}

  @Post('products/price-lists')
  @UseInterceptors(
    FileInterceptor('prices', {
      storage: uploadToDisk({
        disk: 'private',
        key: (file) => `price-lists/${randomUUID()}${file.extension}`,
        contentTypes: ['text/csv'],
        detectContentType: detectPriceList,
      }),
      limits: { fileSize: 1024 * 1024, files: 1 },
    }),
  )
  importPrices(@UploadedFile() file: StoredUpload | undefined) {
    if (!file) {
      throw new BadRequestException('Attach the price list as the "prices" field');
    }
    return this.priceListsService.import(file.key);
  }
}
