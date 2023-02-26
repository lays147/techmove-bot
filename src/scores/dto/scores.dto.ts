import { Timestamp } from '@google-cloud/firestore';

export class ScoreDto {
    username: string;
    minutes: number;
    activity: string;
    team: string;
}
