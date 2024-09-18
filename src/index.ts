import 'dotenv/config';
import type {SlashCommandBuilder} from 'discord.js';
import {Client as DiscordClient, Collection, Events, GatewayIntentBits} from 'discord.js';

interface Client extends DiscordClient {
    commands?: Collection<string, SlashCommandBuilder>;
}

const token = process.env.TOKEN;

const initClient = (): Client => {
    const client: Client = new DiscordClient({intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds]});
    client.commands = new Collection();

    client.once(Events.ClientReady, (readyClient) => {
        console.log(`logged in as ${readyClient.user.tag}`);
    });


    return client;
};

const client = initClient();

client.login(token);
