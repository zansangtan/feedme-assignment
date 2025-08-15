import { Order } from 'src/order/order.model';

export enum BotStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
}

export class Bot {
  id: number;
  status: BotStatus;
  currentOrder?: Order;
  processingTimeout?: NodeJS.Timeout;
  createdAt: Date;

  constructor(id: number) {
    this.id = id;
    this.status = BotStatus.IDLE;
    this.createdAt = new Date();
  }

  startProcessing(order: Order, onComplete: () => void): void {
    order.startProcessing(this.id);

    this.status = BotStatus.PROCESSING;
    this.currentOrder = order;
    this.processingTimeout = setTimeout(() => {
      order.complete();

      this.status = BotStatus.IDLE;
      this.currentOrder = undefined;
      this.processingTimeout = undefined;

      onComplete();
    }, 10000);
  }

  stopProcessing(): Order | null {
    if (this.processingTimeout) {
      clearTimeout(this.processingTimeout);
      this.processingTimeout = undefined;
    }

    if (this.currentOrder) {
      const order = this.currentOrder;
      order.resetToPending();

      this.currentOrder = undefined;
      this.status = BotStatus.IDLE;

      return order;
    }

    return null;
  }

  destroy(): Order | null {
    return this.stopProcessing();
  }
}
