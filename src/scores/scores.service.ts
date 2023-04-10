import { Injectable, Logger } from '@nestjs/common';

import { TODAY } from '@app/constants';
import { TeamsService } from '@app/teams/teams.service';
import { UsersService } from '@app/users/users.service';

import { evaluateDaysInRowBonification } from './business_logic/main';
import { ScoreDto } from './dto/scores.dto';
import { FailedToUpdateUserScore } from './exceptions';

@Injectable()
export class ScoresService {
    private logger: Logger = new Logger(ScoresService.name);

    constructor(
        private usersService: UsersService,
        private teamsService: TeamsService,
    ) {}

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
                user.last_day_of_training = TODAY;
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
        // For each user sum their points to its teams
        users.forEach(user => {
            const points = teams[user.team] ?? 0;
            teams[user.team] = points + user.total_points;
        });
        // Sum user points to team extra points
        const teamsScore = await this.teamsService.getTeams();
        teamsScore.forEach(t => {
            teams[t.team] = teams[t.team] + t.extra_points;
        });
        return teams;
    }
}
