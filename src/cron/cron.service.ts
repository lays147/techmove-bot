import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import {
    DAYS_FOR_PUNISHMENT,
    NO_TEAM_EXERCISE_IN_DAY_PUNISHMENT,
    YESTERDAY,
} from '@app/constants';
import { TeamsService } from '@app/teams/teams.service';
import { UsersService } from '@app/users/users.service';

@Injectable()
export class CronService {
    constructor(
        private usersService: UsersService,
        private teamsService: TeamsService,
    ) {}
    private readonly logger = new Logger(CronService.name);

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async nonActivitiyPunisher() {
        // Rule: If a person does not exercise in six consecutives days, it losses
        // points progressively
        try {
            const users = await this.usersService.getAllUsers();
            for (const user of users) {
                const punishment = this.getPunishmentScore(
                    user.last_day_of_training,
                );
                if (punishment != 0) {
                    user.total_points = user.total_points - punishment;
                    await this.usersService.updateUser(user);
                    this.logger.log(
                        `${user.username} was punished with -${punishment} points \
                        because last day of training was ${user.last_day_of_training}`,
                    );
                }
            }
        } catch (error) {
            this.logger.error(error);
        }
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async nonActivityTeamPunisher() {
        // Rule: If no one on the team exercised in the day, the team losses 1 point.
        try {
            const users = await this.usersService.getAllUsers();
            const teamExerciseDates: { [team: string]: string[] } = {};
            users.forEach(user => {
                if (user.team in teamExerciseDates)
                    teamExerciseDates[user.team].push(
                        user.last_day_of_training,
                    );
                else {
                    teamExerciseDates[user.team] = [user.last_day_of_training];
                }
            });
            for (const team in teamExerciseDates) {
                const punish = !teamExerciseDates[team].includes(YESTERDAY);
                if (punish) {
                    await this.teamsService.updateTeamScore(
                        team,
                        NO_TEAM_EXERCISE_IN_DAY_PUNISHMENT,
                    );
                    this.logger.log(
                        `Team ${team} was punished because no one exercised in the day`,
                    );
                }
            }
        } catch (error) {
            this.logger.error(error);
        }
    }

    getPunishmentScore(date: string): number {
        const last_day = parseInt(date.split('-')[0]);
        const today = new Date();
        const difference = today.getUTCDate() - last_day;
        const punishment = Math.floor(difference / DAYS_FOR_PUNISHMENT);
        switch (punishment) {
            case 1:
                return 1;
            case 2:
                return 7;
            case 3:
                return 14;
            case 4:
                return 21;
            default:
                return 0;
        }
    }
}
