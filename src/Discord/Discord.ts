import { Partials, REST, Routes } from "discord.js"
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { MarkovChain } from "@wiggly-games/markov-chains";
import { WriteLog } from "@wiggly-games/logs";
import { ICommand } from "./Interfaces/IUtilityCommand";
import * as Files from "@wiggly-games/files";
import { CommandFiles, GetStaticData } from "../Helpers";

// Add the commands to discord.js
declare module "discord.js" {
  interface Client {
    commands: Collection<string, ICommand>;
  }
}

// Loads in commands from the Commands/Utility directory.
async function LoadCommands(client: Client, chain: MarkovChain){
  client.commands = new Collection();
  const commandFiles = await Files.GetDescendants(CommandFiles, file => file.endsWith(".js"));
  
  commandFiles.forEach(commandPath => {
    const getCommand = require(commandPath).GetCommand;
    const command = getCommand(chain);
    
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${commandPath} is missing a required "data" or "execute" property.`);
    }
  });
}


// Initializes the Discord bot.
export async function Initialize(chain: MarkovChain){
    const commands = [
      {
        name: 'ping',
        description: 'Replies with Pong!',
        "integration_types": [ 0, 1 ],
        "contexts": [ 0, 1, 2 ]
      },
    ];
    
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
        await command.execute(interaction);
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
            message.reply(await chain.Generate(GetStaticData()));
        }
    });
      
    client.login(process.env.DISCORD_TOKEN);

    LoadCommands(client, chain);

}
