import { Controller, Post, Delete, Get, Res, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { BotService } from 'src/bot/bot.service';
import { BotConverter } from 'src/bot/bot.converter';

@Controller('bots')
export class BotController {
  constructor(
    private readonly botService: BotService,
    private readonly botConverter: BotConverter,
  ) {}

  @Get()
  getAllBots(@Res() res: Response) {
    const botStats = this.botService.getBotStats();

    const allBotEntities = this.botService.getAllBots();
    const allBots = allBotEntities.map((botEntity) =>
      this.botConverter.convertFrom(botEntity),
    );

    return res.status(HttpStatus.OK).json({
      stats: botStats,
      bots: allBots,
    });
  }

  @Post()
  createBot(@Res() res: Response) {
    const botEntity = this.botService.createBot();
    const bot = this.botConverter.convertFrom(botEntity);

    return res.status(HttpStatus.OK).json({
      message: 'Bot created successfully',
      bot,
    });
  }

  @Delete()
  removeBot(@Res() res: Response) {
    const removedBot = this.botService.removeBot();

    if (!removedBot) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'No bot found',
      });
    }

    return res.status(HttpStatus.OK).json({
      message: 'Bot removed successfully',
      removedBot: {
        id: removedBot?.id,
        status: removedBot?.status,
      },
    });
  }
}
