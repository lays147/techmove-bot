import { Module } from '@nestjs/common';

import { UsersModule } from '@app/users/users.module';

import { ScoresModule } from './../scores/scores.module';
import { BotCommands } from './bot.commands';
import { BotRegister } from './bot.register';
import { BotScore } from './bot.scores';

@Module({
    imports: [ScoresModule, UsersModule],
    providers: [BotCommands, BotRegister, BotScore],
})
export class BotModule {}
