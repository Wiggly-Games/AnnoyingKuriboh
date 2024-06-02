/*
    Updates interfaces/classes for Discord to implement some helper methods.
*/

import { BaseInteraction, Collection } from "discord.js";
import { ICommand } from "./Interfaces";
import { TDiscordId } from "../Types";

declare module "discord.js" {
    interface Client {
        commands: Collection<string, ICommand>;
    }
    interface ApplicationCommand {
        integration_types: number[];
    }
}