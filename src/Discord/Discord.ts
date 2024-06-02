import { Colors, Partials } from "discord.js"
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
  Deploy(commands.filter(command => command.Active !== false).map(command => command.Definition));
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

      // go through all the triggers to see if any of them match
      const triggers = await utilities.Database.GetTriggerWords(guildId);
      for (const trigger of triggers) {
        if (message.content.toLowerCase().includes(trigger.TriggerWord)) {
          // if we found one, add it to our queue to respond to
          CommandsQueue.Add(async () => {
            // Check cooldown
            const currentTime = new Date().getTime();
            const lastTime = await utilities.Database.GetCooldown(guildId);
            
            if (lastTime.LastMessageTimestamp + lastTime.Cooldown*1000 >= currentTime) {
              return;
            }
            await utilities.Database.SetLastMessageTimestamp(guildId, currentTime);

            // Generate a new message
            const dataSet = await utilities.Database.GetDataSet(message.author.id);
            const response = await utilities.Chain.Generate(GetDataSet(dataSet));
            const extraText = trigger.ExtraText || "";
            message.reply(response + " " + extraText);
          });

          // break out here, so that we don't respond to multiple strings in one message
          break;
        }
      }
    });
      
    client.login(process.env.DISCORD_TOKEN);

    LoadCommands(client);
}
