import { Partials } from "discord.js"
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import * as Logs from "@wiggly-games/logs";
import { CommandsQueue } from "./Classes";
import { TDependencyInjections } from "../Types";
import { TEventDependencies } from "./Types";
import { OnInteraction, OnReady, OnMessage } from "./Events";
import * as Commands from "./Commands";
export { Deploy as DeployCommands } from "./Commands"

require("./Extensions");

const LogName = "Discord";
let _initialized: boolean = false;

// Initializes the Discord bot.
export async function Initialize(dependencies: TDependencyInjections){
  // If we're already initialized, exit without doing anything
  if (_initialized) {
    Logs.WriteWarning(LogName, "Discord bot has already been initialized");
    return;
  }
  _initialized = true;

  // Create the queue for handling commands
  const commandsQueue = new CommandsQueue();

  // Set up our Event Injections
  // This takes in all the prior dependencies, but adds in some new ones
  let injections: TEventDependencies = {} as TEventDependencies;
  Object.keys(dependencies).forEach(k => injections[k] = dependencies[k]);
  injections.CommandsQueue = commandsQueue;
  injections.LogName = LogName;

  // Start up our client
  const client = new Client({ intents: 
      [GatewayIntentBits.Guilds, 
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
      ],
      partials: [Partials.Channel, Partials.Message, Partials.User]
   });
   injections.Client = client;

   // Listen on events against the client
   client.on("ready", () => OnReady(injections));
   client.on("interactionCreate", (interaction) => OnInteraction(interaction, injections));
   client.on("messageCreate", (message) => OnMessage(message, injections));
      
   // Log in, and load all the commands that should be available on our bot
   client.login(process.env.DISCORD_TOKEN);
   Commands.Load(client);
}
