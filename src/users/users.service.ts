import { CollectionReference } from '@google-cloud/firestore';

import { Inject, Injectable, Logger } from '@nestjs/common';

import { UsersCollection } from './collections/users.collection';
import { UserDto } from './dto/user.dto';
import { FailedToRegisterUser, FailedToRetrieveScores } from './exceptions';
import { parseUsersScoresToString } from './helpers';

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

    async getAllUsers(): Promise<UserDto[]> {
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

    async getAllUsersScoresAsString(): Promise<string> {
        try {
            const snapshot = await this.usersCollection.get();
            const users: UserDto[] = [];
            snapshot.forEach(user => users.push(user.data()));
            const message = parseUsersScoresToString(users);
            return message;
        } catch (error) {
            this.logger.error(error);
            throw new FailedToRetrieveScores();
        }
    }

    createNewUserProfile(username: string, min: number, max: number): UserDto {
        const profile = new UserDto();
        profile.username = username;
        profile.min = min;
        profile.max = max;
        return profile;
    }
}
