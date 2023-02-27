import { Command, Ctx, On, Update } from 'nestjs-telegraf';

import { cleanUpCommand } from '../helpers/main';
import { ScoreDto } from '../scores/dto/scores.dto';
import { ScoresService } from '../scores/scores.service';
import { UsersService } from './../users/users.service';
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
        if (
            message &&
            username &&
            'caption' in message &&
            message.caption?.includes(COMMAND)
        ) {
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
            try {
                const data: ScoreDto = {
                    activity: info.exercise,
                    minutes: info.minutes,
                    team: '',
                    username: username,
                };
                await this.scoresService.add(data);
            } catch (error) {
                await ctx.reply(
                    `@${username} não foi possível salvar sua pontuação! Por favor tente novamente! 💣`,
                );
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
}
