import * as fs from 'fs';
import { TelegrafModule, TelegrafModuleOptions } from 'nestjs-telegraf';
import * as path from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { BotModule } from './bot/bot.module';
import { CronModule } from './cron/cron.module';
import { FirestoreModule } from './firestore/firestore.module';
import { HealthModule } from './health/health.module';
import { ScoresModule } from './scores/scores.module';
import { TeamsModule } from './teams/teams.module';
import { TextParserModule } from './text-parser/text-parser.module';
import { UsersModule } from './users/users.module';

const getFirebaseKeyPath = (configService: ConfigService) => {
    const firebase = configService.get<string>('FIREBASE_KEY_PATH');
    if (firebase) return firebase;
    const creds = configService.get<string>('FIREBASE_CREDS', '');
    const filePath = path.join(process.cwd(), 'firestore.json');
    fs.writeFileSync(filePath, creds);
    return filePath;
};
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
                keyFilename: getFirebaseKeyPath(configService),
            }),
            inject: [ConfigService],
        }),
        ScheduleModule.forRoot(),
        ScoresModule,
        UsersModule,
        TextParserModule,
        CronModule,
        TeamsModule,
        HealthModule,
    ],
    providers: [],
})
export class AppModule {}
