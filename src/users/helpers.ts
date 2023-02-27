import { MAX_OF_EXERCISES, MINIMUM_OF_EXERCISES } from '@app/constants';

export const inRange = (value: number): boolean => {
    return value >= MINIMUM_OF_EXERCISES && value <= MAX_OF_EXERCISES;
};
