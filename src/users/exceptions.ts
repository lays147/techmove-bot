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
