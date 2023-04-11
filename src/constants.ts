export const CURRENT_MONTH = new Date()
    .toLocaleString('default', {
        month: 'long',
    })
    .toLowerCase();

export const TODAY = new Date()
    .toLocaleDateString('pt-BR')
    .split('/')
    .join('-');

export const CODE_SCAPE = '```';

export const MATCH_UNTIL_SPACE = /^[\S]+/;

export const MINIMUM_OF_EXERCISES = 1;

export const MAX_OF_EXERCISES = 7;

export const DAYS_FOR_PUNISHMENT = 7;

export const YESTERDAY = (() => {
    const currentDate = new Date();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(currentDate.getDate() - 1);
    return yesterdayDate.toLocaleDateString('pt-BR').split('/').join('-');
})();

export const NO_TEAM_EXERCISE_IN_DAY_PUNISHMENT = -1;
