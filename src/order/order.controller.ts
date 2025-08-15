import { Controller, Post, Get, Res, HttpStatus, Req } from '@nestjs/common';
import type { Request, Response } from 'express';
import { OrderConverter } from 'src/order/order.converter';
import { CustomerType, OrderStatus } from 'src/order/order.model';
import { OrderService } from 'src/order/order.service';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderConverter: OrderConverter,
  ) {}

  @Get()
  getAllOrders(@Res() res: Response) {
    const orderStats = this.orderService.getOrderStats();
    const pendingOrders = this.orderService
      .getOrdersByStatus(OrderStatus.PENDING)
      .map((order) => this.orderConverter.convertFrom(order));
    const processingOrders = this.orderService
      .getOrdersByStatus(OrderStatus.PROCESSING)
      .map((order) => this.orderConverter.convertFrom(order));
    const completedOrders = this.orderService
      .getOrdersByStatus(OrderStatus.COMPLETE)
      .map((order) => this.orderConverter.convertFrom(order));

    return res.status(HttpStatus.OK).json({
      stats: orderStats,
      pending: pendingOrders,
      processing: processingOrders,
      completed: completedOrders,
    });
  }

  @Post(':customerType')
  createNormalOrder(@Req() req: Request, @Res() res: Response) {
    // ideally customerType should be defined from user profile from authentication / database
    // for now, we just consider it to be controlled by frontend to call into different endpoint
    const customerType = req.params.customerType?.toUpperCase() as CustomerType;

    if (!Object.values(CustomerType).includes(customerType)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: `Order for ${customerType} customer is not supported`,
      });
    }

    const order = this.orderService.createOrder(customerType);

    return res.status(HttpStatus.CREATED).json({
      message: `Order for ${customerType} customer created successfully`,
      order: this.orderConverter.convertFrom(order),
    });
  }
}
