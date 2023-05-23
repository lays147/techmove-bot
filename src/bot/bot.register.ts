import { Command, Ctx, Update } from 'nestjs-telegraf';

import { cleanUpCommand } from '@app/helpers/main';
import { UserDto } from '@app/users/dto/user.dto';
import { inRange } from '@app/users/helpers';
import { UsersService } from '@app/users/users.service';

import { TelegrafContext } from './interfaces/telegraf-context.interface';

UserDto;

@Update()
export class BotRegister {
    constructor(private usersService: UsersService) {}

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
            if (!inRange(min) || !inRange(max) || min > max) {
                await ctx.reply(
                    `@${username} você submeteu valores invalidos! Por favor tente novamente! `,
                );
                return;
            }
            try {
                const profile = this.usersService.createNewUserProfile(
                    username,
                    min,
                    max,
                );
                await this.usersService.add(profile);
                await ctx.reply(
                    `@${username} seu registro foi confirmado com: mínimo de ${profile.min} e máximo de ${profile.max} na semana! 🚀 `,
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
