import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BotStatsDto } from 'src/bot/bot.dto';
import { Bot, BotStatus } from 'src/bot/bot.model';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class BotService {
  private bots: Map<number, Bot> = new Map();
  private nextBotId = 1;

  constructor(private orderService: OrderService) {}

  @OnEvent('order.created')
  onNewOrderAdded(): void {
    this.assignWorkToIdleBots();
  }

  getBotStats(): BotStatsDto {
    const allBots = this.getAllBots();
    const idleBots = this.getBotsByStatus(BotStatus.IDLE);
    const processingBots = this.getBotsByStatus(BotStatus.PROCESSING);

    return {
      total: allBots.length,
      idle: idleBots.length,
      processing: processingBots.length,
    };
  }

  getAllBots(): Bot[] {
    return Array.from(this.bots.values());
  }

  getBotsByStatus(status: BotStatus): Bot[] {
    return this.getAllBots().filter((bot) => bot.status === status);
  }

  createBot(): Bot {
    const bot = new Bot(this.nextBotId++);
    this.bots.set(bot.id, bot);

    this.assignWorkToBot(bot);

    return bot;
  }

  removeBot(): Bot | null {
    const bots = Array.from(this.bots.values());
    if (bots.length === 0) {
      return null;
    }

    const latestBot = bots[bots.length - 1];
    const interruptedOrder = latestBot.destroy();

    this.bots.delete(latestBot.id);
    if (interruptedOrder) {
      this.assignWorkToIdleBots();
    }

    return latestBot;
  }

  private assignWorkToIdleBots(): void {
    const idleBots = this.getBotsByStatus(BotStatus.IDLE);
    idleBots.forEach((bot) => this.assignWorkToBot(bot));
  }

  private assignWorkToBot(bot: Bot): void {
    if (bot.status !== BotStatus.IDLE) {
      return;
    }

    const nextOrder = this.orderService.getNextPendingOrder();
    if (nextOrder) {
      bot.startProcessing(nextOrder, () => {
        this.assignWorkToBot(bot);
      });
    }
  }
}
