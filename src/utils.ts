import {Collection} from 'discord.js';
import {REST, Routes} from 'discord.js';
import type {Client, Command} from './types';
import * as commands from './commands/index';
import * as events from './events/index';

export const loadCommands = async (): Promise<Collection<string, Command>> => {
    const commandsColl = new Collection<string, Command>();

    console.log('fetching commands');

    Object.values(commands).forEach((command) => commandsColl.set(command.data.name, command));

    console.log('finished fetching commands');

    return commandsColl;
};

export const refreshCommands = async (client: Client, token: string): Promise<void> => {
    const rest = new REST().setToken(token);

    try {
        console.log(`Started refreshing ${client.commands?.size} application (/) commands.`);
        const commands: Command[] = Array.from(client.commands?.values() as IterableIterator<Command> ?? []);

        const data = await rest.put(
            Routes.applicationCommands(process.env.APPLICATION_ID ?? ''),
            {body: commands.map((command: Command) => command.data.toJSON())}
        ) as unknown[];

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
};

export const loadEvents = async (client: Client): Promise<void> => {
    console.log('fetching events');

    Object.values(events).forEach((event) => {
        if (event.once) {
            client.once(event.name, async (...args) => await event.execute(...args));
        } else {
            client.on(event.name, async (...args) => await event.execute(...args));
        }
    });

    console.log('finished fetching events');
};
