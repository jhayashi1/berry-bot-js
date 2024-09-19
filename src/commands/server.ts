import type {ChatInputCommandInteraction} from 'discord.js';
import {SlashCommandBuilder} from 'discord.js';
import type {Command} from '../types';

const servers = [
    {name: 'minecraft', value: process.env.MINECRAFT_INSTANCE ?? ''},
    {name: 'factorio', value: process.env.FACTORIO_INSTANCE ?? ''},
    {name: 'grug', value: process.env.GRUG_INSTANCE ?? ''},
];

const execute = async (interaction: ChatInputCommandInteraction): Promise<void> => {
    const extra = interaction.options.getString('action');
    await interaction.reply(`Pong! ${extra}`);
};

export const serverCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Perform actions on game servers')
        .addSubcommand((subcommand) => (
            subcommand.setName('start')
                .setDescription('Start game server')
                .addStringOption((option) => {
                    option.setName('target')
                        .setDescription('Target Game Server')
                        .setRequired(true);

                    servers.forEach((server) => {
                        option.addChoices(server);
                    });

                    return option;
                })
        )),
    execute,
};
