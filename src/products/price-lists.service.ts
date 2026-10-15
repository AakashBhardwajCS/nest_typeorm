import { BadRequestException, Injectable } from '@nestjs/common';
import { StorageDisk } from '@nestjs/storage';
import { ProductsService } from './products.service.js';

interface PriceRow {
  sku: string;
  price: number;
}

@Injectable()
export class PriceListsService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly storageDisk: StorageDisk,
  ) {}

  async import(key: string) {

    let rows: PriceRow[];
    
    try {
      rows = this.parse(await this.storageDisk.getText(key));
      for (const row of rows) {
        this.productsService.findOne(row.sku);
      }
    } catch (error) {
      await this.storageDisk.delete(key);
      throw error;
    }

    for (const row of rows) {
      this.productsService.setPrice(row.sku, row.price);
    }
    return { key, updated: rows.length };
  }

  private parse(text: string): PriceRow[] {
    const lines = text.replace(/^﻿/, '').split(/\r?\n/).slice(1);
    const rows: PriceRow[] = [];

    lines.forEach((line, i) => {
      if (!line.trim()) return;

      const [sku, price, ...rest] = line.split(',').map((cell) => cell.trim());
      const cents = Number(price);
      if (!sku || rest.length > 0 || !Number.isInteger(cents) || cents < 0) {
        throw new BadRequestException(`Line ${i + 2} of the price list is invalid: "${line}"`);
      }
      rows.push({ sku, price: cents });
    });

    if (rows.length === 0) {
      throw new BadRequestException('The price list has no rows');
    }
    return rows;
  }
}
