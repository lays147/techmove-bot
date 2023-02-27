import {
    CODE_SCAPE,
    MAX_OF_EXERCISES,
    MINIMUM_OF_EXERCISES,
} from '@app/constants';

import { UserDto } from './dto/user.dto';

export const parseUsersScoresToString = (users: UserDto[]): string => {
    const data: string[] = users.map(
        user =>
            `${user.username} => ${user.total_of_days} dias seguidos e ${user.total_points} pontos`,
    );

    const content: string[] = [CODE_SCAPE, ...data, CODE_SCAPE];
    const message: string = content.join('\n');
    return message;
};

export const inRange = (value: number): boolean => {
    return value >= MINIMUM_OF_EXERCISES && value <= MAX_OF_EXERCISES;
};
