import { TelegrafModule, TelegrafModuleOptions } from 'nestjs-telegraf';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { BotModule } from './bot/bot.module';
import { FirestoreModule } from './firestore/firestore.module';
import { ScoresModule } from './scores/scores.module';

@Module({
    imports: [
        BotModule,
        ConfigModule.forRoot({ cache: true }),
        TelegrafModule.forRootAsync({
            useFactory: async (configService: ConfigService) =>
                ({
                    token: configService.get<string>('TELEGRAM_BOT_TOKEN'),
                } as TelegrafModuleOptions),
            inject: [ConfigService],
            imports: [ConfigModule],
        }),
        FirestoreModule.forRoot({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                keyFilename: configService.get<string>('FIREBASE_KEY_PATH'),
            }),
            inject: [ConfigService],
        }),
        ScoresModule,
    ],
    providers: [],
})
export class AppModule {}
