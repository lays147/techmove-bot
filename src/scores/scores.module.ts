import { Module } from '@nestjs/common';

import { UsersModule } from '@app/users/users.module';

import { ScoresService } from './scores.service';

@Module({
    imports: [UsersModule],
    providers: [ScoresService],
    exports: [ScoresService],
})
export class ScoresModule {}
