/*
    Handles the Interaction events, which are thrown by any of the slash commands.
    These are things like:
        - /triggers [...]
        - /cooldown [...]
        - /generate
*/

import { Interaction } from "discord.js";
import * as Logs from "@wiggly-games/logs";
import { TEventDependencies } from "../Types";
import { pcall } from "../../Helpers";

export async function OnInteraction(interaction: Interaction, dependencies : TEventDependencies) {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }
  
    await interaction.deferReply({ephemeral: command.Private});

    const { CommandsQueue, LogName } = dependencies;
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
}