import { CURRENT_MONTH } from '@app/constants';

export class TeamsCollection {
    static collectionName = `teams-${CURRENT_MONTH}`;
    team: string;
    extra_points: number;
}
