import { Injectable } from '@nestjs/common';
import { OrderDto } from 'src/order/order.dto';
import { Order } from 'src/order/order.model';

@Injectable()
export class OrderConverter {
  convertFrom(order: Order): OrderDto {
    return {
      id: order.id,
      customerType: order.customerType,
      status: order.status,
      createdAt: order.createdAt,
      processedAt: order.processedAt,
      completedAt: order.completedAt,
      botId: order.botId,
    };
  }
}
