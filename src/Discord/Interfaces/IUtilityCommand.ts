import { ApplicationCommand, CommandInteraction } from "discord.js";
import { IUtilities } from "../../Interfaces";

export interface ICommand {
    Definition: ApplicationCommand;
    Execute(interaction: CommandInteraction, utilities: IUtilities): Promise<void>;
}