import { Ctx, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

import { TelegrafContext } from './interfaces/telegraf-context.interface';

const COMMANDS: { command: string; description: string }[] = [
    {
        command: 'registrar',
        description: 'Registrar no desafio formato',
    },
    { command: 'listar_frangos', description: 'Frangos do dia' },
    { command: 'p', description: 'Registrar exercício do dia' },
    {
        command: 'pontuacao_individual',
        description: 'Listar pontuação individual',
    },
    {
        command: 'pontuacao_geral',
        description: 'Listar pontuação das equipes',
    },
];
@Update()
export class BotCommands {
    constructor(@InjectBot() private bot: Telegraf<TelegrafContext>) {
        bot.telegram.setMyCommands(COMMANDS);
    }

    @Start()
    async start(@Ctx() ctx: TelegrafContext) {
        await ctx.reply('Tech Move Bot inicializado com sucesso!');
    }
}
