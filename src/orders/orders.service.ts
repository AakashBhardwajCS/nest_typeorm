import { Injectable, NotFoundException } from '@nestjs/common';
import type { Order } from './order.interface.js';

@Injectable()
export class OrdersService {
  private readonly orders: Order[] = [
    {
      id: 'ord_1000',
      status: 'paid',
      items: [
        { name: 'Salmon kibble 2kg', quantity: 2, price: 1899 },
        { name: 'Feather wand', quantity: 1, price: 499 },
      ],
      total: 4297,
    },
    {
      id: 'ord_1001',
      status: 'pending',
      items: [{ name: 'Scratching post', quantity: 1, price: 3450 }],
      total: 3450,
    },
  ];

  findOne(id: string): Order {
    const order = this.orders.find((o) => o.id === id);
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return order;
  }
}
