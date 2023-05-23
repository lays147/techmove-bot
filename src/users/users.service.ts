import { CollectionReference } from '@google-cloud/firestore';

import { Inject, Injectable, Logger } from '@nestjs/common';

import { FTODAY } from '@app/constants';
import { stringToPtBrDate } from '@app/helpers/main';
import { ScoreDto } from '@app/scores/dto/scores.dto';

import { UsersCollection } from './collections/users.collection';
import { UserDto } from './dto/user.dto';
import {
    FailedToRegisterUser,
    FailedToRetrieveChickens,
    FailedToRetrieveUser,
    FailedToRetrieveUsers,
    FailedToSaveScore,
    UserAlreadyScoredToday,
} from './exceptions';

const SCORES_COLLECTION = 'scores';
@Injectable()
export class UsersService {
    private logger: Logger = new Logger(UsersService.name);

    constructor(
        @Inject(UsersCollection.collectionName)
        private usersCollection: CollectionReference<UsersCollection>,
    ) {}

    async add(register: UserDto): Promise<void> {
        try {
            const docRef = this.usersCollection.doc(register.username);
            await docRef.set({ ...register });
            return;
        } catch (error) {
            this.logger.error(error);
            throw new FailedToRegisterUser();
        }
    }

    async getUser(username: string): Promise<UserDto | undefined> {
        try {
            const docRef = this.usersCollection.doc(username);
            const document = await docRef.get();
            const user = document.data();
            return user;
        } catch (error) {
            this.logger.error(error);
        }
    }

    async updateUser(user: UserDto) {
        try {
            const docRef = this.usersCollection.doc(user.username);
            await docRef.set({ ...user });
        } catch (error) {
            this.logger.error(error);
            throw new FailedToRetrieveUser();
        }
    }

    async getAllUsers(): Promise<UserDto[]> {
        try {
            const snapshot = await this.usersCollection.get();
            const users: UserDto[] = [];
            snapshot.forEach(user => users.push(user.data()));
            return users;
        } catch (error) {
            this.logger.error(error);
            throw new FailedToRetrieveUsers();
        }
    }

    createNewUserProfile(username: string, min: number, max: number): UserDto {
        const profile = new UserDto();
        profile.username = username;
        profile.min = min;
        profile.max = max;
        return profile;
    }

    async addScore(score: ScoreDto): Promise<void> {
        const docRef = this.usersCollection
            .doc(score.username)
            .collection(SCORES_COLLECTION)
            .doc(FTODAY());
        const doc = await docRef.get();
        if (!doc.exists) {
            try {
                await docRef.set({
                    ...score,
                    created_at: FTODAY(),
                });
            } catch (error) {
                this.logger.error(error);
                throw new FailedToSaveScore();
            }
        } else {
            throw new UserAlreadyScoredToday();
        }
    }

    async retrieveLastSixDatesRecords(username: string): Promise<Date[]> {
        const documents = await this.usersCollection
            .doc(username)
            .collection(SCORES_COLLECTION)
            .orderBy('created_at', 'desc')
            .limit(6)
            .get();

        const dates: Date[] = [];
        documents.forEach(doc => {
            const data = doc.data();
            dates.push(new Date(stringToPtBrDate(data.created_at)));
        });
        return dates;
    }

    async getChickens(): Promise<string[]> {
        try {
            const users = await this.getAllUsers();
            const chickens: string[] = [];

            for (const user of users) {
                const docRef = this.usersCollection
                    .doc(user.username)
                    .collection(SCORES_COLLECTION)
                    .doc(FTODAY());
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
