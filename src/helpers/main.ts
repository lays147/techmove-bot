import { MATCH_UNTIL_SPACE } from '@app/constants';

export const cleanUpCommand = (command: string): string[] => {
    return command.replace(MATCH_UNTIL_SPACE, '').replace(' ', '').split(',');
};
