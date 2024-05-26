import { ApplicationCommand, CommandInteraction } from "discord.js";

export interface ICommand {
    data: ApplicationCommand | Object;
    execute(interaction: CommandInteraction): Promise<void>;
}