import { ScoreDto } from './dto/scores.dto';
import { ScoresDocument } from './documents/scores.documents';
import {
    Inject,
    Injectable,
    Logger,
    UnprocessableEntityException,
} from '@nestjs/common';
import { CollectionReference } from '@google-cloud/firestore';

@Injectable()
export class ScoresService {
    private logger: Logger = new Logger(ScoresService.name);

    constructor(
        @Inject(ScoresDocument.collectionName)
        private scoresCollection: CollectionReference<ScoresDocument>,
    ) {}

    async add(score: ScoreDto): Promise<void> {
        const currDate = new Date()
            .toLocaleDateString('pt-BR')
            .split('/')
            .join('-');
        try {
            const docRef = this.scoresCollection
                .doc(score.username)
                .collection('events')
                .doc(currDate);
            await docRef.set({
                ...score,
                created_at: currDate,
            });
        } catch (error) {
            this.logger.error(error);
            throw new UnprocessableEntityException(
                'Unable to save data to Firestore.',
            );
        }
    }
}
