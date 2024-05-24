import { Partials, REST, Routes } from "discord.js"
import { Client, GatewayIntentBits } from 'discord.js';
import { MarkovChain } from "@wiggly-games/markov-chains";
import { WriteLog } from "@wiggly-games/logs";


export async function Initialize(chain: MarkovChain){
    const commands = [
      {
        name: 'ping',
        description: 'Replies with Pong!',
        "integration_types": [ 0, 1 ],
        "contexts": [ 0, 1, 2 ]
      },
    ];
    
    const client = new Client({ intents: [GatewayIntentBits.Guilds, 
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
    
    client.on('interactionCreate', async interaction => {
      if (!interaction.isChatInputCommand()) return;
    
      if (interaction.commandName === 'ping') {
        console.log(interaction);
        WriteLog("DiscordBot", `Prompt from ${interaction.user.globalName} (${interaction.user.username})`)
        await interaction.reply(await chain.Generate());
      }
    });

    client.on("messageCreate", async function(message) {
        if (message.mentions.users.has(client.user.id) || message.content.indexOf("meow irl") !== -1) {
            message.reply(await chain.Generate());
        }
    });
      
    client.login(process.env.DISCORD_TOKEN);
    
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    
    try {
      console.log('Started refreshing application (/) commands.');
    
      await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands });
    
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }

}
