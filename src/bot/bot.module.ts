import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { BotTelegraf } from './bot.telegraf';

@Module({
    imports: [ConfigModule],
    providers: [BotTelegraf],
})
export class BotModule {}
