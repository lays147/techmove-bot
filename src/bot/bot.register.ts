import { Command, Ctx, Update } from 'nestjs-telegraf';
import { cleanUpCommand, inRange } from '../helpers/main';
import { RegistrationService } from '../registration/registration.service';

import { TelegrafContext } from './interfaces/telegraf-context.interface';

@Update()
export class BotRegister {
    constructor(private registrationService: RegistrationService) {}

    @Command('registrar')
    async registration(@Ctx() ctx: TelegrafContext) {
        const message = ctx.message;
        const username = ctx.message?.from.username ?? '';
        let inputs: string[];

        if (message && username && 'text' in message) {
            inputs = cleanUpCommand(message.text);
            if (inputs.length != 2) {
                await ctx.replyWithMarkdownV2(
                    `@${username} verifique se passou os valores corretamente, e tente novamente: \nExemplo: */registrar 1,2* 😉`,
                );
                return;
            }
            const min = parseInt(inputs[0]);
            const max = parseInt(inputs[1]);
            if (!inRange(min) || !inRange(max)) {
                await ctx.reply(
                    `@${username} você submeteu valores invalidos! Por favor tente novamente! `,
                );
                return;
            }
            try {
                this.registrationService.add({
                    username: username,
                    min: min,
                    max: max,
                });
                await ctx.reply(
                    `@${username} seu registro foi confirmado com: mínimo de ${inputs[0]} e máximo de ${inputs[1]} na semana! 🚀 `,
                );
                return;
            } catch {
                await ctx.reply(
                    `@${username} houve um erro ao finalizar seu registro. Por favor tente novamente! 💣`,
                );
                return;
            }
        }
        await ctx.reply(
            'Este bot não recebeu as informações necessárias para processar a ação. Será que foi a Skynet? 🤖',
        );
    }
}
