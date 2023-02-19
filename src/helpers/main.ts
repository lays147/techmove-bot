const MATCH_UNTIL_SPACE = /^[\S]+/;
const MINIMUM_OF_EXERCISES = 1;
const MAX_OF_EXERCISES = 7;

export const cleanUpCommand = (command: string): string[] => {
    return command.replace(MATCH_UNTIL_SPACE, '').replace(' ', '').split(',');
};

export const inRange = (value: number): boolean => {
    return value >= MINIMUM_OF_EXERCISES && value <= MAX_OF_EXERCISES;
};
