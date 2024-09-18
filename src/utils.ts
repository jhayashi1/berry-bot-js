/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type {SlashCommandBuilder} from 'discord.js';
import type {Collection} from 'discord.js';
import {readdirSync} from 'node:fs';
import {fileURLToPath, pathToFileURL} from 'node:url';

import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadCommands = async () => {
    console.log('fetching commands');

    const folderPath = path.join(__dirname, 'commands');
    const commandFolder = readdirSync(folderPath);

    const commands = await commandFolder.reduce<Promise<unknown[]>>(async (accPromise, file) => {
        const acc = await accPromise;
        const filePath = path.join(folderPath, file);
        const fileUrl = pathToFileURL(filePath).href;
        const commandImport = await import(fileUrl);
        Object.keys(commandImport).forEach((name) => {
            const command = commandImport[name];
            acc.push(command.data.toJSON());
            console.log(`added ${name} command`);
        });

        return acc;
    }, Promise.resolve([]));

    console.log('finished fetching commands');

    return commands;
};
