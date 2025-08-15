export interface OrderDto {
  id: number;
  customerType: string;
  status: string;
  createdAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  botId?: number;
}

export interface OrderStatsDto {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  vipPending: number;
  normalPending: number;
}
