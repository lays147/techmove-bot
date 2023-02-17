import { ConfigService } from '@nestjs/config';
import { Command, Ctx, InjectBot, Start, Update } from 'nestjs-telegraf';
import { cleanUpCommand } from 'src/helpers/main';
import { Telegraf } from 'telegraf';

import { TelegrafContext } from './interfaces/telegraf-context.interface';

@Update()
export class BotTelegraf {
    constructor(
        @InjectBot() private bot: Telegraf<TelegrafContext>,
        private configService: ConfigService,
    ) {
        bot.telegram.setMyCommands([
            {
                command: 'registrar',
                description: 'Registrar no desafio formato',
            },
            { command: 'listar_frangos', description: 'Frangos do dia' },
            { command: 'pontuar', description: 'Registrar exercício do dia' },
            {
                command: 'pontuacao_individual',
                description: 'Listar pontuação individual',
            },
            {
                command: 'pontuacao_geral',
                description: 'Listar pontuação das equipes',
            },
        ]);
    }
    @Start()
    async start(@Ctx() ctx: TelegrafContext) {
        await ctx.reply('Tech Move Bot inicializado com sucesso!');
    }

    @Command('registrar')
    async registration(@Ctx() ctx: TelegrafContext) {
        const message = ctx.message;
        const username = ctx.message?.from.username;
        let inputs: string[];

        if (message && 'text' in message) {
            inputs = cleanUpCommand(message.text);
            if (inputs.length != 2) {
                await ctx.replyWithMarkdownV2(
                    `@${username} verifique se passou os valores corretamente, e tente novamente: \nExemplo: */registrar 1,2* 😉`,
                );
                return;
            }
            await ctx.reply(
                `@${username} seu registro foi confirmado com: mínimo de ${inputs[0]} e máximo de ${inputs[1]} na semana! 🚀 `,
            );
        }
        await ctx.reply(
            'Este bot não recebeu as informações necessárias para processar a ação. Será que foi a Skynet? 🤖',
        );
    }
}
