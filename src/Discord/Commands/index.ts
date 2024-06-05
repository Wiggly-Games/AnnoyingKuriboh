/*
    Helper methods for working with Commands.
        - Load grabs all Commands, and sets them into a collection built on the Discord Client object.
        - Deploy deploys the commands so that they're available from our Discord bot.
*/

import * as Files from "@wiggly-games/files";
import { Paths } from "../../Helpers";
import { ICommand } from "../Interfaces";
import { Client, Collection, REST, Routes } from "discord.js";

// Fetches and loads all commands from the Commands folder.
async function GetCommands(): Promise<ICommand[]> {
    const commands = [ ];

    // Grab all JavaScript files, but ignore this index file.
    const commandFiles = await Files.GetDescendants(Paths.Commands, file => file.endsWith(".js") && !file.endsWith("index.js"));
    commandFiles.forEach(commandPath => {
        const command = require(commandPath);
        
        if ('Definition' in command && 'Execute' in command) {
            commands.push(command);
        } else {
            console.log(`[WARNING] The command at ${commandPath} is missing a required "Definition" or "Execute" property.`);
        }
    });

    return commands;
}

// Loads in commands from the Commands/Utility directory.
export async function Load(client: Client){
    client.commands = new Collection();
    const commands = await GetCommands();

    commands.forEach(command => {
        client.commands.set(command.Definition.name, command);
    })
}

// Deploys commands to our bot.
export async function Deploy(){
    const commands = await GetCommands();
    const commandDefinitions = commands.filter(command => command.Active !== false).map(command => command.Definition);

    // Connect to the REST API
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    // Upload our commands
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commandDefinitions });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}