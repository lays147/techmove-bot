import { Injectable, Logger } from '@nestjs/common';

import { UsersService } from '@app/users/users.service';

import { evaluateDaysInRowBonification } from './business_logic/main';
import { ScoreDto } from './dto/scores.dto';
import { FailedToUpdateUserScore } from './exceptions';

@Injectable()
export class ScoresService {
    private logger: Logger = new Logger(ScoresService.name);

    constructor(private usersService: UsersService) {}

    async add(score: ScoreDto): Promise<void> {
        // First let's save the point
        await this.usersService.addScore(score);

        // Second: Let's update username point and check if any bonification is available
        try {
            const user = await this.usersService.getUser(score.username);
            if (user) {
                user.days_in_row++;
                user.extra_points = evaluateDaysInRowBonification(
                    user.days_in_row,
                    user.extra_points,
                );
                user.total_points = user.days_in_row + user.extra_points;
                await this.usersService.updateUser(user);
            }
        } catch (error) {
            this.logger.error(error);
            throw new FailedToUpdateUserScore();
        }
    }

    async getTeamsScores(): Promise<TeamsInterface> {
        const users = await this.usersService.getAllUsers();
        const teams: TeamsInterface = {};
        users.forEach(user => {
            const points = teams[user.team] ?? 0;
            teams[user.team] = points + user.total_points;
        });
        return teams;
    }
}
