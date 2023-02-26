import { ScoresModule } from './../scores/scores.module';
import { BotScore } from './bot.scores';
import { BotCommands } from './bot.commands';
import { Module } from '@nestjs/common';
import { BotRegister } from './bot.register';
import { RegistrationModule } from '../registration/registration.module';

@Module({
    imports: [RegistrationModule, ScoresModule],
    providers: [BotCommands, BotRegister, BotScore],
})
export class BotModule {}
