import { UnprocessableEntityException } from '@nestjs/common';

export class FailedToSavescore extends UnprocessableEntityException {
    constructor() {
        super('Failed to save score to Firestore');
    }
}

export class FailedToUpdateUserScore extends UnprocessableEntityException {
    constructor() {
        super('Failed to updade user score to Firestore');
    }
}
