import { Module } from '@nestjs/common';

import { TeamsModule } from '@app/teams/teams.module';
import { UsersModule } from '@app/users/users.module';

import { CronService } from './cron.service';

@Module({
    imports: [UsersModule, TeamsModule],
    providers: [CronService],
    exports: [CronService],
})
export class CronModule {}
