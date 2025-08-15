import { OrderDto } from 'src/order/order.dto';

export interface BotDto {
  id: number;
  status: string;
  createdAt: Date;
  currentOrder?: Pick<OrderDto, 'id' | 'customerType'> | null;
}

export interface BotStatsDto {
  total: number;
  idle: number;
  processing: number;
}
