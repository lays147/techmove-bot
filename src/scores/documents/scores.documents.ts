import { ScoreDto } from '../dto/scores.dto';

const MONTH = new Date().toLocaleString('default', { month: 'long' });

export class ScoresDocument extends ScoreDto {
    static collectionName = `scores-${MONTH.toLowerCase()}`;
    created_at: string;
}
