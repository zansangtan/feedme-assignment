import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderStatsDto } from 'src/order/order.dto';
import { CustomerType, Order, OrderStatus } from 'src/order/order.model';

@Injectable()
export class OrderService {
  private orders: Map<number, Order> = new Map();
  private nextOrderId = 1;

  constructor(private readonly eventEmitter: EventEmitter2) {}

  getOrderStats(): OrderStatsDto {
    const allOrders = this.getAllOrders();
    const pendingOrders = this.getOrdersByStatus(OrderStatus.PENDING);
    const processingOrders = this.getOrdersByStatus(OrderStatus.PROCESSING);
    const completedOrders = this.getOrdersByStatus(OrderStatus.COMPLETE);

    const vipPendingOrders = pendingOrders.filter(
      (o) => o.customerType === CustomerType.VIP,
    );
    const normalPendingOrders = pendingOrders.filter(
      (o) => o.customerType === CustomerType.NORMAL,
    );

    return {
      total: allOrders.length,
      pending: pendingOrders.length,
      processing: processingOrders.length,
      completed: completedOrders.length,
      vipPending: vipPendingOrders.length,
      normalPending: normalPendingOrders.length,
    };
  }

  getAllOrders(): Order[] {
    return Array.from(this.orders.values());
  }

  getOrderById(id: number): Order | undefined {
    return this.orders.get(id);
  }

  getOrdersByStatus(status: OrderStatus): Order[] {
    return this.getAllOrders()
      .filter((order) => order.status === status)
      .sort((a, b) => {
        if (status === OrderStatus.PENDING) {
          // to prioritise vip order, we will sort by both
          // customerType and createdAt if status is pending
          if (
            a.customerType === CustomerType.VIP &&
            b.customerType === CustomerType.NORMAL
          ) {
            return -1;
          }
          if (
            a.customerType === CustomerType.NORMAL &&
            b.customerType === CustomerType.VIP
          ) {
            return 1;
          }
        }
        return a.createdAt.getTime() - b.createdAt.getTime();
      });
  }

  getNextPendingOrder(): Order | null {
    const pendingOrders = this.getOrdersByStatus(OrderStatus.PENDING);
    return pendingOrders.length > 0 ? pendingOrders[0] : null;
  }

  createOrder(customerType: CustomerType): Order {
    const order = new Order(this.nextOrderId++, customerType);
    this.orders.set(order.id, order);
    this.eventEmitter.emit('order.created', {});
    return order;
  }
}
