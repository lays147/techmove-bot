import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule, TelegrafModuleOptions } from 'nestjs-telegraf';
import { BotModule } from './bot/bot.module';
import { FirestoreModule } from './firestore/firestore.module';
import { RegistrationModule } from './registration/registration.module';

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
        RegistrationModule,
    ],
    providers: [],
})
export class AppModule {}
