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

export class FailedToRetrieveScores extends UnprocessableEntityException {
    constructor() {
        super('Failed to retrieve scores from Firestore');
    }
}

export class FailedToRetrieveChickens extends UnprocessableEntityException {
    constructor() {
        super('Failed to retrieve chickens from Firestore');
    }
}
