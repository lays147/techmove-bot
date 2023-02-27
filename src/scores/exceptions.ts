export class FailedToSavescore extends Error {
    constructor() {
        super('Failed to save score to Firestore');
    }
}

export class FailedToUpdateUserScore extends Error {
    constructor() {
        super('Failed to updade user score to Firestore');
    }
}

export class FailedToRetrieveScores extends Error {
    constructor() {
        super('Failed to retrieve scores from Firestore');
    }
}

export class FailedToRetrieveChickens extends Error {
    constructor() {
        super('Failed to retrieve chickens from Firestore');
    }
}
