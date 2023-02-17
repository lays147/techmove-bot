const MATCH_UNTIL_SPACE = /^[\S]+/;

export const cleanUpCommand = (command: string): string[] => {
    return command.replace(MATCH_UNTIL_SPACE, '').replace(' ', '').split(',');
};
