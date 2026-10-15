import { Injectable } from '@nestjs/common';
import { InjectDisk, StorageDisk } from '@nestjs/storage';
import { ProductsService } from './products.service.js';

@Injectable()
export class PhotosService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectDisk('photos') private readonly photos: StorageDisk,
  ) {}

  async replace(productId: string, key: string): Promise<{ id: string; photoUrl: string }> {
    
    let previous: string | undefined;

    try {
      previous = this.productsService.findOne(productId).photoKey;
      this.productsService.setPhoto(productId, key);
    } catch (error) {
      await this.photos.delete(key);
      throw error;
    }

    if (previous) {
      await this.photos.delete(previous);
    }

    return { id: productId, photoUrl: this.photos.url(key) };
  }
}
