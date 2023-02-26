const DAYS = 6;

export const evaluateDaysInRowBonification = (
    days_in_row: number,
    extra_points: number,
): number => {
    return days_in_row % DAYS == 0
        ? Math.round(days_in_row / DAYS)
        : extra_points;
};
