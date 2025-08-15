import { Injectable } from '@nestjs/common';
import { BotDto } from 'src/bot/bot.dto';
import { Bot } from 'src/bot/bot.model';

@Injectable()
export class BotConverter {
  // convertTo(): Bot {}

  convertFrom(bot: Bot): BotDto {
    return {
      id: bot.id,
      status: bot.status,
      createdAt: bot.createdAt,
      currentOrder: bot.currentOrder
        ? {
            id: bot.currentOrder.id,
            customerType: bot.currentOrder.customerType,
          }
        : null,
    };
  }
}
