import { Injectable } from '@nestjs/common';

import { CODE_SCAPE } from '@app/constants';
import { UserDto } from '@app/users/dto/user.dto';

@Injectable()
export class TextParserService {
    parseUsersScoresToString(users: UserDto[]): string {
        const data: string[] = users.map(
            user =>
                `${user.username} => ${user.total_of_days} dias seguidos e ${user.total_points} pontos`,
        );
        const title = 'Pontuação Individual 📢';
        const content: string[] = [CODE_SCAPE, title, ...data, CODE_SCAPE];
        return content.join('\n');
    }

    parseChickensToString(users: string[]): string {
        if (users.length != 0) {
            return `Frangos do dia! 🐣 \n ${users.map(user => `@${user}\n`)}`;
        }
        return 'Não temos nenhum frango 🐣 hoje! Vocês estão de parabéns! 🎉';
    }

    parseTeamsScoresToString(teams: TeamsInterface): string {
        const scores = [];
        for (const [key, value] of Object.entries(teams)) {
            scores.push(`Time ${key} => ${value} pontos.`);
        }
        const title = 'Pontuação geral 🧑‍🤝‍🧑';
        const content: string[] = [CODE_SCAPE, title, ...scores, CODE_SCAPE];
        return content.join('\n');
    }
}
