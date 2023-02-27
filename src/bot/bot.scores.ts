import { Command, Ctx, On, Update } from 'nestjs-telegraf';

import { cleanUpCommand } from '@app/helpers/main';
import { ScoreDto } from '@app/scores/dto/scores.dto';
import { ScoresService } from '@app/scores/scores.service';
import { UsersService } from '@app/users/users.service';

import { UserAlreadyScoredToday } from './../users/exceptions';
import { PontuationInput } from './interfaces/pontuation.interface';
import { TelegrafContext } from './interfaces/telegraf-context.interface';

const COMMAND = '/p';

@Update()
export class BotScore {
    constructor(
        private scoresService: ScoresService,
        private usersService: UsersService,
    ) {}

    static parseInput(inputs: string[]): PontuationInput {
        return {
            minutes: parseInt(inputs[0]),
            exercise: inputs[1],
        };
    }

    @On('photo')
    async score(@Ctx() ctx: TelegrafContext) {
        const message = ctx.message;
        const username = ctx.message?.from.username ?? '';
        let inputs: string[];
        let info: PontuationInput;
        let user;
        if (
            message &&
            username &&
            'caption' in message &&
            message.caption?.includes(COMMAND)
        ) {
            // First let's get user info
            try {
                user = await this.usersService.getUser(username);
                if (!user) {
                    ctx.reply(`@${username}, não encontramos seu registro!`);
                    return;
                }
            } catch {
                ctx.reply(
                    'Houve uma falha para consultar o seu registro. Será que foi a Skynet? 🤖',
                );
                return;
            }

            // Second let's clean up the input data
            inputs = cleanUpCommand(message.caption);
            if (inputs.length != 2) {
                await ctx.replyWithMarkdownV2(
                    `@${username} verifique as informações submetidas e tente novamente: \nExemplo: */p minutos,exercícios 😉`,
                );
                return;
            } else {
                info = BotScore.parseInput(inputs);
                if (info.minutes < 30) {
                    await ctx.reply(
                        `@${username} O exercício deve ser de no mínimo 30 minutos!`,
                    );
                    return;
                }
            }

            // Third let's create user score data and submit
            try {
                const data: ScoreDto = {
                    activity: info.exercise,
                    minutes: info.minutes,
                    team: user.team,
                    username: username,
                };
                await this.scoresService.add(data);
            } catch (error) {
                if (error instanceof UserAlreadyScoredToday) {
                    await ctx.reply(
                        `@${username} você já pontuou hoje! Estamos de 👀!`,
                    );
                } else {
                    await ctx.reply(
                        `@${username} não foi possível salvar sua pontuação! Por favor tente novamente! 💣`,
                    );
                }
                return;
            }
            await ctx.reply(`@${username} você pontuou!`);
        }
    }

    @Command('pontuacao_individual')
    async individualScores(@Ctx() ctx: TelegrafContext) {
        try {
            const message = await this.usersService.getAllUsersScoresAsString();
            ctx.replyWithMarkdownV2(message);
        } catch (error) {
            ctx.reply(
                'Houve uma falha para consultar a pontuação. Será que foi a Skynet? 🤖',
            );
        }
    }

    @Command('/listar_frangos')
    async listChickens(@Ctx() ctx: TelegrafContext) {
        try {
            const users = await this.scoresService.getChickens();
            const message = `Frangos do dia! 🐣 \n ${users.map(
                user => `@${user}\n`,
            )}`;
            ctx.reply(message);
        } catch {
            ctx.reply(
                'Houve uma falha para consultar a pontuação. Será que foi a Skynet? 🤖',
            );
        }
    }

    @Command('pontuacao_geral')
    async teamScores(@Ctx() ctx: TelegrafContext) {
        try {
            const scores = await this.scoresService.getTeamsScores();
            const message = `Pontuação geral 🧑‍🤝‍🧑 \n ${JSON.stringify(scores)}`;
            ctx.reply(message);
        } catch (error) {
            ctx.reply(
                'Houve uma falha para consultar a pontuação. Será que foi a Skynet? 🤖',
            );
        }
    }
}
