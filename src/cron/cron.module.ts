import { Module } from '@nestjs/common';

import { UsersModule } from '@app/users/users.module';

import { CronService } from './cron.service';

@Module({
    imports: [UsersModule],
    providers: [CronService],
    exports: [CronService],
})
export class CronModule {}
