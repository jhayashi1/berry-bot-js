import type {ChatInputCommandInteraction, ClientEvents, Collection, Interaction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder} from 'discord.js';
import type {Client as DiscordClient} from 'discord.js';

export interface Client extends DiscordClient {
    commands?: Collection<string, unknown>;
}

export interface Command {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export interface Event {
    name: keyof ClientEvents;
    once: boolean;
    execute: (interaction: Interaction) => Promise<void>;
}
