import type {ChatInputCommandInteraction} from 'discord.js';
import {SlashCommandBuilder} from 'discord.js';

const execute = async (interaction: ChatInputCommandInteraction): Promise<void> => {
    await interaction.reply('Pong!');
};

export const yuhCommand = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    execute,
};
