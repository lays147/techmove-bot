import { CollectionReference } from '@google-cloud/firestore';

import { Inject, Injectable } from '@nestjs/common';

import { TeamsCollection } from './collections/teams.collections';

@Injectable()
export class TeamsService {
    constructor(
        @Inject(TeamsCollection.collectionName)
        private teamsCollection: CollectionReference<TeamsCollection>,
    ) {}

    async getTeams(): Promise<TeamsCollection[]> {
        const snapshot = await this.teamsCollection.get();
        const teams: TeamsCollection[] = [];
        snapshot.forEach(team => {
            teams.push(team.data());
        });
        return teams;
    }

    async updateTeamScore(team: string, score: number): Promise<void> {
        const docRef = this.teamsCollection.doc(team);
        const document = await docRef.get();
        const teamData = document.data();
        if (teamData) {
            teamData.extra_points += score;
            docRef.set(teamData);
        } else {
            docRef.set({ team: team, extra_points: score });
        }
    }
}
