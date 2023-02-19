import { BotCommands } from './bot.commands';
import { Module } from '@nestjs/common';
import { BotRegister } from './bot.register';
import { RegistrationModule } from '../registration/registration.module';

@Module({
    imports: [RegistrationModule],
    providers: [BotCommands, BotRegister],
})
export class BotModule {}
