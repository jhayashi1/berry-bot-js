import {REST, Routes} from 'discord.js';

const token = process.env.TOKEN;

const rest = new REST({version: '10'}).setToken(token);
