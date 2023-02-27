import { TelegrafModule, TelegrafModuleOptions } from 'nestjs-telegraf';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { BotModule } from './bot/bot.module';
import { CronModule } from './cron/cron.module';
import { FirestoreModule } from './firestore/firestore.module';
import { ScoresModule } from './scores/scores.module';
import { TextParserModule } from './text-parser/text-parser.module';
import { UsersModule } from './users/users.module';

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
        ScheduleModule.forRoot(),
        ScoresModule,
        UsersModule,
        TextParserModule,
        CronModule,
    ],
    providers: [],
})
export class AppModule {}
