import { Partials } from "discord.js"
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import * as Files from "@wiggly-games/files";
import { ICommand } from "./Interfaces";
import { Paths, GetDataSet } from "../Helpers";
import { IUtilities } from "../Interfaces";
import { Deploy } from "./Deploy";
import * as CommandsQueue from "./CommandsQueue";
require("./Extensions");

// Add the commands to discord.js
// Fetches and loads all commands from the Commands folder.
async function GetCommands(): Promise<ICommand[]> {
  const commands = [ ];

  const commandFiles = await Files.GetDescendants(Paths.Commands, file => file.endsWith(".js"));
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
async function LoadCommands(client: Client){
  client.commands = new Collection();
  const commands = await GetCommands();

  commands.forEach(command => {
    client.commands.set(command.Definition.name, command);
  })
}

// Deploys commands to our bot.
export async function DeployCommands(){
  const commands = await GetCommands();
  Deploy(commands.map(command => command.Definition));
}

// Initializes the Discord bot.
export async function Initialize(utilities: IUtilities){
    const client = new Client({ intents: 
      [GatewayIntentBits.Guilds, 
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
      ],
      partials: [Partials.Channel, Partials.Message, Partials.User]
   });

    client.on('ready', () => {
      console.log(`Logged in as ${client.user.tag}!`);
    });
    
    // Respond to Interaction Commands (slash commands)
    client.on('interactionCreate', async interaction => {
      if (!interaction.isChatInputCommand()) return;
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }
    
		  await interaction.deferReply({ephemeral: command.Private});
      CommandsQueue.Add(async () => {
        try {
          await command.Execute(interaction, utilities);
        } catch (error) {
          console.error(error);
          if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
          } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
          }
        }
      })
    });

    // Respond to messages being generated
    client.on("messageCreate", async function(message) {
      const guildId = message.guildId;
      if (guildId === undefined) {
        return;
      }

      // ignore messages sent from the bot
      if (message.author.id === client.user.id) {
        return;
      }

      const triggers = await utilities.Database.GetTriggerWords(guildId);
      triggers.forEach(trigger => {
        if (message.content.toLowerCase().includes(trigger.TriggerWord)) {
          CommandsQueue.Add(async () => {
            const dataSet = await utilities.Database.GetDataSet(message.author.id);
            const response = await utilities.Chain.Generate(GetDataSet(dataSet));

            message.reply(response + " " + trigger.ExtraText);
          });
          return;
        }
      });
    });
      
    client.login(process.env.DISCORD_TOKEN);

    LoadCommands(client);
}
