import 'dotenv/config';
import type {Collection} from 'discord.js';
import {Client as DiscordClient, Events, GatewayIntentBits, REST, Routes} from 'discord.js';
import {loadCommands} from './utils';

interface Client extends DiscordClient {
    commands?: Collection<string, unknown>;
}

const token = process.env.TOKEN ?? '';

const initClient = async (): Promise<Client> => {
    const client: Client = new DiscordClient({intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds]});
    client.commands = await loadCommands();

    client.once(Events.ClientReady, (readyClient) => {
        console.log(`logged in as ${readyClient.user.tag}`);
    });

    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(token);

    // and deploy your commands!
    (async () => {
        try {
            console.log(`Started refreshing ${client.commands!.size} application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(
                Routes.applicationCommands(process.env.APPLICATION_ID),
                {body: Array.from(client.commands!.values()).map((command) => command.data.toJSON())}
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
        // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    })();

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
