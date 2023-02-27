import { UserDto } from '../scores/dto/user.dto';

const MATCH_UNTIL_SPACE = /^[\S]+/;
const MINIMUM_OF_EXERCISES = 1;
const MAX_OF_EXERCISES = 7;
const CODE_SCAPE = '```';

export const cleanUpCommand = (command: string): string[] => {
    return command.replace(MATCH_UNTIL_SPACE, '').replace(' ', '').split(',');
};

export const inRange = (value: number): boolean => {
    return value >= MINIMUM_OF_EXERCISES && value <= MAX_OF_EXERCISES;
};

export const parseUsersScoresToString = (users: UserDto[]): string => {
    const data: string[] = users.map(
        user =>
            `${user.username} => ${user.days_in_row} dias seguidos e ${user.total_points} pontos`,
    );

    const content: string[] = [CODE_SCAPE, ...data, CODE_SCAPE];
    const message: string = content.join('\n');
    return message;
};

export const TODAY = new Date()
    .toLocaleDateString('pt-BR')
    .split('/')
    .join('-');
