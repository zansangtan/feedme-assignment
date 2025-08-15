export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
}

export enum CustomerType {
  NORMAL = 'NORMAL',
  VIP = 'VIP',
}

export class Order {
  id: number;
  customerType: CustomerType;
  status: OrderStatus;
  createdAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  botId?: number;

  constructor(id: number, customerType: CustomerType) {
    this.id = id;
    this.customerType = customerType;
    this.status = OrderStatus.PENDING;
    this.createdAt = new Date();
  }

  startProcessing(botId: number): void {
    this.status = OrderStatus.PROCESSING;
    this.processedAt = new Date();
    this.botId = botId;
  }

  complete(): void {
    this.status = OrderStatus.COMPLETE;
    this.completedAt = new Date();
  }

  resetToPending(): void {
    this.status = OrderStatus.PENDING;
    this.processedAt = undefined;
    this.botId = undefined;
  }
}
