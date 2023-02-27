import { CollectionReference } from '@google-cloud/firestore';

import { Inject, Injectable, Logger } from '@nestjs/common';

import { TODAY } from '@app/constants';

import { evaluateDaysInRowBonification } from './business_logic/main';
import { ScoresCollection } from './documents/scores.documents';
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
        @Inject(ScoresCollection.collectionName)
        private scoresCollection: CollectionReference<ScoresCollection>,
    ) {}

    async add(score: ScoreDto): Promise<void> {
        const currDate = new Date()
            .toLocaleDateString('pt-BR')
            .split('/')
            .join('-');
        // First let's save the point
        try {
            const docRef = this.scoresCollection
                .doc(score.username)
                .collection('events')
                .doc(currDate);
            await docRef.set({
                ...score,
                created_at: currDate,
            });
        } catch (error) {
            this.logger.error(error);
            throw new FailedToSavescore();
        }
        // Second: Let's update username point and check if any bonification is available
        try {
            const docRef = this.scoresCollection.doc(score.username);
            const obj = await docRef.get();
            const user = obj.data();
            if (user) {
                user.days_in_row++;
                user.extra_points = evaluateDaysInRowBonification(
                    user.days_in_row,
                    user.extra_points,
                );
                user.total_points = user.days_in_row + user.extra_points;
                await docRef.set({ ...user });
            }
        } catch (error) {
            this.logger.error(error);
            throw new FailedToUpdateUserScore();
        }
    }

    async getAll(): Promise<UserDto[]> {
        try {
            const snapshot = await this.scoresCollection.get();
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
                const docRef = this.scoresCollection
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
}
