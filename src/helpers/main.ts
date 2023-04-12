import { MATCH_UNTIL_SPACE } from '@app/constants';

export const cleanUpCommand = (command: string): string[] => {
    return command.replace(MATCH_UNTIL_SPACE, '').replace(' ', '').split(',');
};

export const stringToPtBrDate = (date: string): Date => {
    return new Date(date.split('-').reverse().join('/') + ' 00:00:00');
};
