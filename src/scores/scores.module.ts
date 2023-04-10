import { Module } from '@nestjs/common';

import { TeamsModule } from '@app/teams/teams.module';
import { UsersModule } from '@app/users/users.module';

import { ScoresService } from './scores.service';

@Module({
    imports: [UsersModule, TeamsModule],
    providers: [ScoresService],
    exports: [ScoresService],
})
export class ScoresModule {}
