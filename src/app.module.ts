import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BotController } from 'src/bot/bot.controller';
import { BotConverter } from 'src/bot/bot.converter';
import { BotService } from 'src/bot/bot.service';
import { OrderController } from 'src/order/order.controller';
import { OrderConverter } from 'src/order/order.converter';
import { OrderService } from 'src/order/order.service';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [OrderController, BotController],
  providers: [
    OrderService,
    OrderConverter,
    {
      provide: BotService,
      useFactory: (orderService: OrderService) => new BotService(orderService),
      inject: [OrderService],
    },
    BotConverter,
  ],
})
export class AppModule {}
