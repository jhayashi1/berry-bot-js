import {SlashCommandBuilder} from 'discord.js';
import {DescribeInstancesCommand, EC2Client, StartInstancesCommand, StopInstancesCommand, waitUntilInstanceRunning, type DescribeInstancesCommandOutput} from '@aws-sdk/client-ec2';
import type {ChatInputCommandInteraction, SlashCommandSubcommandsOnlyBuilder} from 'discord.js';
import type {Command} from '../types';
import 'dotenv/config';

const ec2 = new EC2Client({region: 'us-east-1'});

const actions = [
    {name: 'start', description: 'Start game server'},
    {name: 'stop', description: 'Stop game server'},
    {name: 'status', description: 'Get game server status'},
];

const servers = [
    {name: 'minecraft', value: process.env.MINECRAFT_INSTANCE ?? ''},
    {name: 'factorio', value: process.env.FACTORIO_INSTANCE ?? ''},
    {name: 'grug', value: process.env.GRUG_INSTANCE ?? ''},
];

const startInstanceAndWait = async (instanceId: string): Promise<string> => {
    const startResp = await ec2.send(new StartInstancesCommand({InstanceIds: [instanceId], DryRun: true}));
    const status = startResp.$metadata.httpStatusCode;

    if (status !== 200) {
        return `Server start request returned status: ${status}`;
    }

    const waitResponse = await waitUntilInstanceRunning(
        {client: ec2, maxWaitTime: 30},
        {InstanceIds: [instanceId]}
    );

    if (waitResponse.state !== 'SUCCESS') {
        return `Waiter returned status: ${waitResponse.state}`;
    }

    const resp = await getInstanceById(instanceId);
    const instanceInfo = resp.Reservations?.[0].Instances?.[0];
    const ip = instanceInfo?.PublicIpAddress;

    return `Successfully started server with ip: ${ip}`;
};

const stopInstance = async (instanceId: string): Promise<string> => {
    const resp = await ec2.send(new StopInstancesCommand({InstanceIds: [instanceId], DryRun: true}));
    const status = resp.$metadata.httpStatusCode;

    if (status !== 200) {
        return `Server stop request returned status: ${status}`;
    }

    return 'Server successfully stopped';
};

const getInstanceById = async (instanceId: string): Promise<DescribeInstancesCommandOutput> => {
    return await ec2.send(new DescribeInstancesCommand({InstanceIds: [instanceId]}));
};

const execute = async (interaction: ChatInputCommandInteraction): Promise<void> => {
    const subcommand = interaction.options.getSubcommand();
    const instanceId = interaction.options.getString('target');
    let result = '';

    if (!instanceId) {
        interaction.reply('Could not find instance id');
        return;
    }

    await interaction.deferReply();

    if (subcommand === 'start') {
        result = await startInstanceAndWait(instanceId);
    } else if (subcommand === 'stop') {
        result = await stopInstance(instanceId);
    } else if (subcommand === 'status') {
        const resp = await getInstanceById(instanceId);
        const instance = resp.Reservations?.[0].Instances?.[0];
        const state = instance?.State?.Name;

        if (state === 'running') {
            const ip = instance?.PublicIpAddress;
            result = `Server is currently running with ip: ${ip}`;
        } else {
            result = `Server is currently in state: ${state}`;
        }
    }

    interaction.editReply(result);
};

const createServerCommand = (): SlashCommandSubcommandsOnlyBuilder => {
    const command = new SlashCommandBuilder()
        .setName('server')
        .setDescription('Perform actions on game servers');

    actions.forEach((action) => (
        command.addSubcommand((subcommand) => (
            subcommand.setName(action.name)
                .setDescription(action.description)
                .addStringOption((option) => {
                    console.log(`adding subcommand ${action.name}`);
                    option.setName('target')
                        .setDescription('Target Game Server')
                        .setRequired(true);

                    servers.forEach((server) => {
                        option.addChoices(server);
                    });

                    return option;
                })
        ))
    ));

    return command;
};

export const serverCommand: Command = {
    data: createServerCommand(),
    execute,
};
