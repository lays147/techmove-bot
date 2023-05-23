import { Injectable, Logger } from '@nestjs/common';

import { DAYS_OF_THE_WEEK, FTODAY } from '@app/constants';
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
                // Evaluate if we need to reset days_in_row
                user.days_in_row = (await this.shouldResetDaysInRow(
                    score.username,
                ))
                    ? 0
                    : user.days_in_row;
                user.days_in_row++;
                user.total_of_days++;
                // Now we evaluate if there's a bonus
                user.extra_points = evaluateDaysInRowBonification(
                    user.days_in_row,
                    user.extra_points,
                );
                user.total_points = user.total_of_days + user.extra_points;
                user.last_day_of_training = FTODAY();
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

    private async shouldResetDaysInRow(username: string): Promise<boolean> {
        const dates = await this.usersService.retrieveLastSixDatesRecords(
            username,
        );
        /*
            Rules for reset:
            - Evaluation can only happen if at least six exercises are registered
            - It receives a list with six trainings ordered from the most recent to the oldest
            - The most recent training is compared with the oldest one
            - If the difference between these 2 trainings is bigger than seven, days in row should be reseted
            - If the difference is below 7, days in row should remain unchanged
        */
        if (dates.length < 6) {
            return false;
        }
        const firstDate = dates[dates.length - 1]; // Oldest training date
        const lastDate = dates[0]; // Last training date
        const timeDifference = lastDate.getTime() - firstDate.getTime();
        const daysDifference = Math.floor(
            timeDifference / (1000 * 60 * 60 * 24),
        );
        return daysDifference <= DAYS_OF_THE_WEEK ? false : true;
    }
}
