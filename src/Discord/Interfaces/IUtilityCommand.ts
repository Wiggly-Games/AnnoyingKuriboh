import { ApplicationCommand, CommandInteraction } from "discord.js";
import { TDependencyInjections } from "../../Types";

export interface ICommand {
    Private: boolean;
    Active: boolean;
    Definition: ApplicationCommand;
    Execute(interaction: CommandInteraction, dependencies: TDependencyInjections): Promise<void>;
}