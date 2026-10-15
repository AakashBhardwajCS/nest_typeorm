export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  status: 'pending' | 'paid' | 'shipped';
  items: OrderItem[];
  total: number;
}
