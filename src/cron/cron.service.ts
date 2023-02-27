import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { DAYS_FOR_PUNISHMENT } from '@app/constants';
import { UsersService } from '@app/users/users.service';

@Injectable()
export class CronService {
    constructor(private usersService: UsersService) {}
    private readonly logger = new Logger(CronService.name);

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async nonActivitiyPunisher() {
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
