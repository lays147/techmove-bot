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
}
