import { CollectionReference } from '@google-cloud/firestore';

import { Inject, Injectable, Logger } from '@nestjs/common';

import { TODAY } from '@app/constants';
import { UsersCollection } from '@app/users/collections/users.collection';
import { UsersService } from '@app/users/users.service';

import { evaluateDaysInRowBonification } from './business_logic/main';
import { ScoreDto } from './dto/scores.dto';
import { UserDto } from './dto/user.dto';
import {
    FailedToRetrieveChickens,
    FailedToRetrieveScores,
    FailedToSavescore,
    FailedToUpdateUserScore,
} from './exceptions';

@Injectable()
export class ScoresService {
    private logger: Logger = new Logger(ScoresService.name);

    constructor(
        @Inject(UsersCollection.collectionName)
        private usersCollection: CollectionReference<UsersCollection>,
        private usersService: UsersService,
    ) {}

    async add(score: ScoreDto): Promise<void> {
        // First let's save the point
        try {
            const docRef = this.usersCollection
                .doc(score.username)
                .collection('events')
                .doc(TODAY);
            await docRef.set({
                ...score,
                created_at: TODAY,
            });
        } catch (error) {
            this.logger.error(error);
            throw new FailedToSavescore();
        }
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

    async getAll(): Promise<UserDto[]> {
        try {
            const snapshot = await this.usersCollection.get();
            const users: UserDto[] = [];
            snapshot.forEach(user => users.push(user.data()));
            return users;
        } catch (error) {
            this.logger.error(error);
            throw new FailedToRetrieveScores();
        }
    }

    async getChickens(): Promise<string[]> {
        try {
            const users = await this.getAll();
            const chickens: string[] = [];

            for (const user of users) {
                const docRef = this.usersCollection
                    .doc(user.username)
                    .collection('events')
                    .doc(TODAY);
                const doc = await docRef.get();
                if (!doc.exists) {
                    chickens.push(user.username);
                }
            }
            return chickens;
        } catch (error) {
            this.logger.error(error);
            throw new FailedToRetrieveChickens();
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
