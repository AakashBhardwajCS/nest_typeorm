import { Module } from '@nestjs/common';
import { PhotosController } from './photos.controller.js';
import { PhotosService } from './photos.service.js';
import { PriceListsController } from './price-lists.controller.js';
import { PriceListsService } from './price-lists.service.js';
import { ProductsService } from './products.service.js';

@Module({
  controllers: [PhotosController, PriceListsController],
  providers: [ProductsService, PhotosService, PriceListsService],
})
export class ProductsModule {}
