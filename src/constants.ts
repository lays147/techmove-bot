import { dateToPtBRString } from './helpers/main';

export const CURRENT_MONTH = new Date()
    .toLocaleString('default', {
        month: 'long',
    })
    .toLowerCase();

export const TODAY = dateToPtBRString(new Date());

export const FTODAY = () => {
    const currentDate = new Date();
    const utcMinus3Date = new Date(
        currentDate.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }),
    );
    return dateToPtBRString(utcMinus3Date);
};

export const CODE_SCAPE = '```';

export const MATCH_UNTIL_SPACE = /^[\S]+/;

export const MINIMUM_OF_EXERCISES = 1;

export const MAX_OF_EXERCISES = 7;

export const DAYS_FOR_PUNISHMENT = 7;

export const DAYS_OF_THE_WEEK = 7;

export const YESTERDAY = (() => {
    const currentDate = new Date();
    const utcMinus3Date = new Date(
        currentDate.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }),
    );
    const yesterdayDate = new Date();
    yesterdayDate.setDate(utcMinus3Date.getDate() - 1);
    return dateToPtBRString(yesterdayDate);
})();

export const NO_TEAM_EXERCISE_IN_DAY_PUNISHMENT = -1;
