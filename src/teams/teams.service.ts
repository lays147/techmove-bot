import { CollectionReference } from '@google-cloud/firestore';

import { Inject, Injectable, Logger } from '@nestjs/common';

import { FTODAY } from '@app/constants';
import { UsersCollection } from '@app/users/collections/users.collection';
import { UserDto } from '@app/users/dto/user.dto';

import { TeamsCollection } from './collections/teams.collections';
import { FailedToEvaluateTeamBonus, TeamNotFound } from './exceptions';

@Injectable()
export class TeamsService {
    private logger: Logger = new Logger(TeamsService.name);

    constructor(
        @Inject(TeamsCollection.collectionName)
        private teamsCollection: CollectionReference<TeamsCollection>,
        @Inject(UsersCollection.collectionName)
        private usersCollection: CollectionReference<UsersCollection>,
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
            docRef.set({
                team: team,
                extra_points: score,
                team_days_in_row: 0,
            });
        }
    }

    async retrieveTeamMembers(team: string): Promise<UserDto[]> {
        const snapshot = await this.usersCollection
            .where('team', '==', team)
            .get();
        if (snapshot.empty) {
            this.logger.warn(`Team ${team} not found`);
            throw new TeamNotFound(team);
        }
        const members: UserDto[] = [];
        snapshot.forEach(user => members.push(user.data()));
        return members;
    }

    async retrieveTeam(team: string): Promise<TeamsCollection | undefined> {
        const docRef = this.teamsCollection.doc(team);
        const document = await docRef.get();
        if (!document.exists) {
            docRef.set({
                team: team,
                extra_points: 0,
                team_days_in_row: 0,
            });
            const newDocument = await docRef.get();
            return document.data();
        }
        return document.data();
    }

    async evalTeamExerciseBonus(team: string): Promise<number> {
        try {
            const currTeam = await this.retrieveTeam(team);
            const teamMembers = await this.retrieveTeamMembers(team);

            const todayBonus = teamMembers.reduce((acc, member) => {
                return acc && member.last_day_of_training == FTODAY();
            }, true);

            if (currTeam && todayBonus) {
                currTeam.team_days_in_row += 1;
                currTeam.extra_points += currTeam.team_days_in_row;
                const docRef = this.teamsCollection.doc(team);
                docRef.set(currTeam);
                this.logger.log(
                    `Team ${team} was awarded ${currTeam.team_days_in_row} points`,
                );
                return currTeam.team_days_in_row;
            }
            return 0;
        } catch (error) {
            this.logger.error(error);
            throw new FailedToEvaluateTeamBonus();
        }
    }
}
