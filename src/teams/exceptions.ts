export class TeamNotFound extends Error {
    constructor(team: string) {
        super(`The given team ${team} was not found in db.`);
    }
}

export class FailedToEvaluateTeamBonus extends Error {
    constructor() {
        super('Error on evaluating team bonus.');
    }
}
