import {Collection, REST, Routes} from 'discord.js';
import {readdirSync} from 'node:fs';
import {fileURLToPath, pathToFileURL} from 'node:url';

import path from 'node:path';
import 'dotenv/config';
import type {Client, Command} from './types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadCommands = async (): Promise<Collection<string, unknown>> => {
    console.log('fetching commands');

    const folderPath = path.join(__dirname, 'commands');
    const commandFolder = readdirSync(folderPath);

    const commands = await commandFolder.reduce<Promise<Collection<string, unknown>>>(async (accPromise, file) => {
        const acc = await accPromise;
        const filePath = path.join(folderPath, file);
        const fileUrl = pathToFileURL(filePath).href;
        const commandImport = await import(fileUrl);
        Object.keys(commandImport).forEach((name) => {
            const command = commandImport[name];
            acc.set(command.data.name, command);
            console.log(`added ${name} command`);
        });

        return acc;
    }, Promise.resolve(new Collection<string, unknown>()));

    console.log('finished fetching commands');
    return commands;
};

export const refreshCommands = async (client: Client, token: string): Promise<void> => {
    const rest = new REST().setToken(token);

    try {
        console.log(`Started refreshing ${client.commands?.size} application (/) commands.`);
        const commands: Command[] = Array.from(client.commands?.values() ?? []);

        const data = await rest.put(
            Routes.applicationCommands(process.env.APPLICATION_ID ?? ''),
            {body: commands.map((command: Command) => command.data.toJSON())}
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
};
