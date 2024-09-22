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

export interface McStatusResp {
    online: boolean;
    host: string;
    port: number;
    ip_address: string;
    version: {
        name_raw: string;
        name_clean: string;
        name_html: string;
        protocol: number;
    };
    players: {
        online: number;
        max: number;
        list: {
            uuid: string;
            name_raw: string;
            name_clean: string;
            name_html: string;
        }[];
    };
    motd: {
        raw: string;
        clean: string;
        html: string;
    };
}
