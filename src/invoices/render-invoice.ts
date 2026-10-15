import type { Order } from '../orders/order.interface.js';

const usd = (cents: number) => (cents / 100).toFixed(2);


export function renderInvoice(order: Order): Buffer {
  const lines = order.items.map((item) => `% ${item.quantity} x ${item.name}  ${usd(item.price)}`);
  return Buffer.from(
    ['%PDF-1.7', `% Invoice for ${order.id}`, ...lines, `% Total ${usd(order.total)} USD`, '%%EOF', ''].join('\n'),
  );
}
