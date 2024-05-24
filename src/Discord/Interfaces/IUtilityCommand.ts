import { ApplicationCommand, CommandInteraction } from "discord.js";

export interface ICommand {
    Data: ApplicationCommand;
    Execute(interaction: CommandInteraction): Promise<void>;
}