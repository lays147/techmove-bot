import { Module } from '@nestjs/common';

import { TeamsService } from './teams.service';

@Module({
    providers: [TeamsService],
    exports: [TeamsService],
})
export class TeamsModule {}
