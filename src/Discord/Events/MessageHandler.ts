/*
    Handles events started from messages.
    This happens whenever a message is sent within a Discord server that the bot has been added to.
*/

import { Message } from "discord.js";
import * as Logs from "@wiggly-games/logs";
import { TEventDependencies } from "../Types";
import { TCooldown, TDiscordId } from "../../Types";
import { GetDataSet, pcall } from "../../Helpers";

const ERROR_MESSAGE = `I tried to send this to your chat but failed. This is very much not lalala 😿 \nAnyway, {MESSAGE}`;
const HELP_MESSAGE = `Oh, that's nothing, sir; merely a malfunction, old data. Pay it no mind. .....\nYou can join our [Support Server](https://discord.gg/nB3NhBXegG) for help.`

// Checks if this message is asking for help from Kuriboh.
function CheckIsHelpMessage(message: string) {
    const lowerCaseMessage = message.toLowerCase();
    return lowerCaseMessage.includes("help") && lowerCaseMessage.includes("kuriboh");
}

// Checks if we should respond to a message.
// This is if:
//   - The message was sent in DMs
//   - The message contains one of the trigger words
//   - The message is "Help me Kuriboh, you're my only hope"
async function checkShouldRespond(message: Message, { Database, Client }): Promise<{HasTrigger: boolean, ExtraText?: string | undefined}> {
    // 1. Check if the message was sent from the bot - if so, we should ignore it
    if (message.author.id === Client.user.id) {
        return {HasTrigger: false};
    }

    // 2. Check if this is sent in DMs
    const guildId = message.guildId;
    if (guildId === undefined) {
        return {HasTrigger: true, ExtraText: ""};
    }

    // 3. Check if the message is "Help" + "Kuriboh"
    if (CheckIsHelpMessage(message.content)) {
        return {HasTrigger: true, ExtraText: ""};
    }

    // 4. Check for any trigger words to be found within the message
    const lowerCaseMessage = message.content.toLowerCase();
    const triggers = await Database.GetTriggerWords(guildId);
    for (const trigger of triggers) {
      if (lowerCaseMessage.includes(trigger.TriggerWord)) {
        // We found a trigger word
        return {HasTrigger: true, ExtraText: trigger.ExtraText};
      }
    }

    // If it doesn't match any of the conditions, don't respond to it
    return {HasTrigger: false};
}

// Returns the Cooldown data for the last time that we sent a message to this server.
async function GetCooldown(guildId: TDiscordId | undefined, { Database }): Promise<TCooldown> {
    if (guildId === undefined) {
        return {
            LastMessageTimestamp: 0,
            Cooldown: 0
        };
    }

    return await Database.GetCooldown(guildId);
}

// Checks if we can send a new message. Returns a boolean indicating if we should continue.
async function CheckCooldownForNewMessage(message: Message, dependencies: TEventDependencies): Promise<boolean> {
    const currentTime = new Date().getTime();
    const lastTime = await GetCooldown(message.guildId, dependencies);
    
    if (lastTime.LastMessageTimestamp + lastTime.Cooldown*1000 >= currentTime) {
      return false;
    }
    
    // Set that a new message was sent
    const { Database } = dependencies;
    await Database.SetLastMessageTimestamp(message.guildId, currentTime);

    // Return that we should continue forward
    return true;
}

// Responds to a message.
async function RespondToMessage(message: Message, extraText: string | undefined, dependencies: TEventDependencies) {
    // Check that we aren't waiting for a cooldown
    const hasPassedCooldown = await CheckCooldownForNewMessage(message, dependencies);
    if (!hasPassedCooldown) {
        return;
    }

    // If this is the help request, hardcode the result
    const { Database, Chain, LogName } = dependencies;
    let messageToSend: string;
    if (CheckIsHelpMessage(message.content)) {
        messageToSend = HELP_MESSAGE;
    } else {
        // Generate a new message
        const dataSet = await Database.GetDataSet(message.author.id);
        const response = await Chain.Generate(GetDataSet(dataSet));
        messageToSend = response + " " + extraText;
    }

    // Respond to the message
    // Note: This might fail, so we need to wrap it in a try-catch block
    try {
        await message.reply(messageToSend);
    } catch (e) {
        // Log the error
        Logs.WriteError(LogName, e);

        // Send the response to the author of the message instead
        // Note: This can also fail (eg. if the author doesn't have DMs enabled), so we need to pcall it
        await pcall(async () => {
            await message.author.send(ERROR_MESSAGE.replace("{MESSAGE}", messageToSend));
        });
    }


}

// Main event handler / entry point
export async function OnMessage(message: Message, dependencies: TEventDependencies) {
    // Check if we can ignore this message
    const messageCheck = await checkShouldRespond(message, dependencies);
    if (!messageCheck.HasTrigger) {
        return;
    }

    // Otherwise, we need to add it to our commands queue
    const { CommandsQueue } = dependencies;
    CommandsQueue.Add(async () => await RespondToMessage(message, messageCheck.ExtraText !== null ? messageCheck.ExtraText : "", dependencies));
}