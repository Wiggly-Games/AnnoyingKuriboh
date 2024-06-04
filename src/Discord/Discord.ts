import { Colors, Partials } from "discord.js"
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import * as Files from "@wiggly-games/files";
import * as Logs from "@wiggly-games/logs";
import { ICommand } from "./Interfaces";
import { Paths, GetDataSet } from "../Helpers";
import { Deploy } from "./Deploy";
import * as CommandsQueue from "./CommandsQueue";
import { TDependencyInjections } from "../Types";
require("./Extensions");

const LogName = "Discord";
const ErrorMessage = `I tried to send this to your chat but failed. This is very much not lalala 😿 \nAnyway, {MESSAGE}`;

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

// Runs a function, catching errors. Returns a boolean indicating success.
// Should only be used in catch blocks, so that we don't throw errors within errors.
async function pcall(f: ()=>Promise<void>): Promise<boolean> {
  try {
    await f();
    return true;
  } catch {
    return false;
  }
}

// Initializes the Discord bot.
export async function Initialize(dependencies: TDependencyInjections){
  const { Chain, Database } = dependencies;

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
          await command.Execute(interaction, dependencies);
        } catch (error) {
          Logs.WriteError(LogName, error);
          await pcall(async ()=>{
            if (interaction.replied || interaction.deferred) {
              await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
              await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
          });
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
      const triggers = await Database.GetTriggerWords(guildId);
      for (const trigger of triggers) {
        if (message.content.toLowerCase().includes(trigger.TriggerWord)) {
          // if we found one, add it to our queue to respond to
          CommandsQueue.Add(async () => {
            // Check cooldown
            const currentTime = new Date().getTime();
            const lastTime = await Database.GetCooldown(guildId);
            
            if (lastTime.LastMessageTimestamp + lastTime.Cooldown*1000 >= currentTime) {
              return;
            }
            await Database.SetLastMessageTimestamp(guildId, currentTime);

            // Generate a new message
            const dataSet = await Database.GetDataSet(message.author.id);
            const response = await Chain.Generate(GetDataSet(dataSet));
            const extraText = trigger.ExtraText || "";
            const messageToSend = response + " " + extraText;

            // Try sending the response, note that this can fail, so we need to catch exceptions
            try {
              await message.reply(messageToSend);
            } catch (error) {
              Logs.WriteError(LogName, error);

              // Try sending a message to the author .... this can fail too so we should wrap it in a pcall
              await pcall(async () => {
                await message.author.send(ErrorMessage.replace("{MESSAGE}", messageToSend));
              });
            }
          });

          // break out here, so that we don't respond to multiple strings in one message
          break;
        }
      }
    });
      
    client.login(process.env.DISCORD_TOKEN);
    LoadCommands(client);
}
