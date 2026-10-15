import { Injectable, NotFoundException } from '@nestjs/common';
import type { Product } from './product.js';

@Injectable()
export class ProductsService {
  private readonly products: Product[] = [
    { id: 'prod_1', name: 'abcd', price: 1899 },
    { id: 'prod_2', name: 'efgh', price: 499 },
    { id: 'prod_3', name: 'ijk', price: 3450 },
  ];

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: string): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    return product;
  }

  setPhoto(id: string, photoKey: string): Product {
    const product = this.findOne(id);
    product.photoKey = photoKey;
    return product;
  }

  setPrice(id: string, price: number): Product {
    const product = this.findOne(id);
    product.price = price;
    return product;
  }
}
