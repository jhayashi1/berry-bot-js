import 'dotenv/config';
import {Client as DiscordClient, Events, GatewayIntentBits} from 'discord.js';
import {loadCommands, refreshCommands} from './utils';
import type {Client} from './types';

const token = process.env.TOKEN ?? '';

const initClient = async (): Promise<Client> => {
    const client: Client = new DiscordClient({intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds]});
    client.commands = await loadCommands();

    client.once(Events.ClientReady, (readyClient) => {
        console.log(`logged in as ${readyClient.user.tag}`);
    });

    await refreshCommands(client, token);

    return client;
};

const client = await initClient();

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({content: 'There was an error while executing this command!', ephemeral: true});
        } else {
            await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
        }
    }
});

client.login(token);
