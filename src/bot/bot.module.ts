import { Module } from '@nestjs/common';
import { BotTelegraf } from './bot.telegraf';
import { RegistrationModule } from 'src/registration/registration.module';

@Module({
    imports: [RegistrationModule],
    providers: [BotTelegraf],
})
export class BotModule {}
