import { WinstonModule } from 'nest-winston';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { winstonConfig } from './config/winston.config';

async function bootstrap() {
    const logger = WinstonModule.createLogger(winstonConfig);
    const app = await NestFactory.create(AppModule, { logger });

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 3000);

    await app.listen(port);
}
bootstrap();
