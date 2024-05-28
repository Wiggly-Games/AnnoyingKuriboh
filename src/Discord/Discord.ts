import { Partials, REST, Routes } from "discord.js"
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { MarkovChain } from "@wiggly-games/markov-chains";
import * as Files from "@wiggly-games/files";
import { ICommand } from "./Interfaces";
import { CommandFiles, GetStaticData } from "../Helpers";
import { IUtilities } from "../Interfaces";
import { Deploy } from "./Deploy";

// Add the commands to discord.js
declare module "discord.js" {
  interface Client {
    commands: Collection<string, ICommand>;
  }
  interface ApplicationCommand {
    integration_types: number[];
  }
}

// Fetches and loads all commands from the Commands folder.
async function GetCommands(): Promise<ICommand[]> {
  const commands = [ ];

  const commandFiles = await Files.GetDescendants(CommandFiles, file => file.endsWith(".js"));
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
    });

    // Respond to messages being generated
    client.on("messageCreate", async function(message) {
        if (message.mentions.users.has(client.user.id) || message.content.indexOf("meow irl") !== -1) {
            message.reply(await utilities.Chain.Generate(GetStaticData()));
        }
    });
      
    client.login(process.env.DISCORD_TOKEN);

    LoadCommands(client);
}
