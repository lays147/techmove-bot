export class FailedToRetrieveScores extends Error {
    constructor() {
        super('Failed to retrieve scores from Firestore');
    }
}

export class FailedToRegisterUser extends Error {
    constructor() {
        super('Failed to register user to Firestore');
    }
}

export class FailedToRetrieveUser extends Error {
    constructor() {
        super('Failed to retrieve user data from Firestore');
    }
}

export class UserAlreadyScoredToday extends Error {}

export class FailedToSaveScore extends Error {
    constructor() {
        super('Failed to save score to Firestore');
    }
}

export class FailedToRetrieveChickens extends Error {
    constructor() {
        super('Failed to retrieve chickens from Firestore');
    }
}
