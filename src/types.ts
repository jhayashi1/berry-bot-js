import type {ChatInputCommandInteraction, Collection, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder} from 'discord.js';
import type {Client as DiscordClient} from 'discord.js';

export interface Client extends DiscordClient {
    commands?: Collection<string, unknown>;
}

export interface Command {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

