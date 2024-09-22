import 'dotenv/config';
import {Client as DiscordClient, Events, GatewayIntentBits} from 'discord.js';
import {loadCommands, loadEvents, refreshCommands} from './utils';
import type {Client} from './types';

const token = process.env.TOKEN ?? '';

const initClient = async (): Promise<void> => {
    const client: Client = new DiscordClient({intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds]});
    client.commands = await loadCommands();
    await loadEvents(client);

    client.once(Events.ClientReady, (readyClient) => {
        console.log(`logged in as ${readyClient.user.tag}`);
    });

    await refreshCommands(client, token);

    client.login(token);
};

try {
    initClient();
} catch (e) {
    console.error(e);
}
