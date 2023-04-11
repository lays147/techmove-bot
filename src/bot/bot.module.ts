import { Module } from '@nestjs/common';

import { ScoresModule } from '@app/scores/scores.module';
import { TeamsModule } from '@app/teams/teams.module';
import { TextParserModule } from '@app/text-parser/text-parser.module';
import { UsersModule } from '@app/users/users.module';

import { BotCommands } from './bot.commands';
import { BotRegister } from './bot.register';
import { BotScore } from './bot.scores';

@Module({
    imports: [ScoresModule, UsersModule, TextParserModule, TeamsModule],
    providers: [BotCommands, BotRegister, BotScore],
})
export class BotModule {}
